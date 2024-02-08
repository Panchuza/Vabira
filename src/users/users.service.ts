import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { DbException } from 'src/exception/dbException';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtPayload } from 'src/auth/interfaces';
import { Profiles } from 'src/entities/profile.entity';
import { ProfileUser } from 'src/entities/profileUser.entity';
import { AccessProfile } from 'src/entities/accessProfile.entity';
import { Access } from 'src/entities/access.entity';
import { UserStatus } from 'src/entities/userStatus.entity';
import { TypeService } from 'src/type/type.service';


@Injectable()
export class UsersService {

  constructor(

    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profiles)
    private profileRepository: Repository<Profiles>,
    @InjectRepository(ProfileUser)
    private profileUserRepository: Repository<ProfileUser>,
    @InjectRepository(AccessProfile)
    private accessProfileRepository: Repository<AccessProfile>,
    private jwtService: JwtService,
    private typeService: TypeService,
    @InjectEntityManager()
    private entityManager: EntityManager,

  ) { }

  async create(createUserDto: CreateUserDto, validationCode: boolean) {
    if (validationCode == false) {
      throw new BadRequestException('El código verificador es incorrecto');
    }

    const { username, email, dni, dateOfBirth, password, roles, profileType, ...toCreate } = createUserDto;

    let role: any = createUserDto.roles

    let profile;
    if (profileType == 'Client') {
      profile = await this.profileRepository.findOne({
        where: { name: 'Client' },
      });
    }
    if (profileType == 'Admin') {
      profile = await this.profileRepository.findOne({
        where: { name: 'Admin' },
      });
    }
    if (profileType == 'User') {
      profile = await this.profileRepository.findOne({
        where: { name: 'User' },
      });
    }
    if (profileType == 'Supplier') {
      profile = await this.profileRepository.findOne({
        where: { name: 'Supplier' },
      });
    }

    try {
      const isValid = await this.validation(username, email, dni);
      if (!isValid) {
        const userDto = this.userRepository.create({
          ...toCreate,
          password: bcrypt.hashSync(password, 10)
        });

        const userProfile = this.profileUserRepository.create({
          profile: profile
        });

        userDto.profileUser = [userProfile];

        userDto.username = username
        userDto.email = email
        userDto.dni = dni
        userDto.dateOfBirth = this.newFormatDate(dateOfBirth);
        userDto.createdAt = this.formatDate(new Date());
        userDto.active = true;
        userDto.roles = role.toString();


        let userResult: any;
        await this.entityManager.transaction(async (transaction) => {
          try {
            userResult = await transaction.save(userDto);
            const newUserStatus = new UserStatus();
            newUserStatus.statusRegistrationDateTime = this.formatDate(new Date());
            newUserStatus.userStatusType = await this.validateTypeUserStatusActivo();
            newUserStatus.user = userResult;
            await transaction.save(UserStatus, newUserStatus);
            delete userResult.password;
          } catch (error) {
            console.log(error);
            throw new DbException(error, HttpStatus.INTERNAL_SERVER_ERROR);
          }
        });
        return {
          status: HttpStatus.CREATED,
          data: userResult,
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Ya existe un usuario con el username o email ingresado',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.log(error);
      throw new DbException("Error de validación", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateTypeUserStatusActivo() {
    return await this.typeService.findTypeByCodeJust('UsuarioActivo')

  }

  async validateTypeUserStatusLicencia() {
    return await this.typeService.findTypeByCodeJust('UsuarioInactivoPorVacaciones')

  }

  async login(loginUserDto: LoginDto) {

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true } //! OJO!
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  private getJwtToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);

    return token;

  }

  async checkAuthStatus(user: User) {

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }

  async validation(username, email, dni) {
    const userFound = await this.userRepository.findOne({
      where: [{ username: username }, { email: email }, { dni: dni }]
    });

    if (!userFound) {
      return false;
    } else {
      return true;
    }
  }

  async codeProfileSupplier() {
    return await this.profileRepository.findOne({ where: { name: 'Supplier' } })
  }

  async codeProfileAdmin() {
    return await this.profileRepository.findOne({ where: { name: 'Admin' } })
  }

  async codeProfileClient() {
    return await this.profileRepository.findOne({ where: { name: 'Client' } })
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'password'],
    });
  }

  async findAll() {
    const users = await this.userRepository.createQueryBuilder('User')
      .select(['User.id', 'User.username', 'User.firstName', 'User.lastName', 'User.email'
        , 'User.dni', 'User.dateOfBirth', 'User.active', 'User.roles'])
      .addSelect(['userStatus.id', 'userStatus.userStatusType', 'userStatus.dateTo'])
      .addSelect(['userStatusType.id', 'userStatusType.name'])
      .leftJoinAndSelect('User.profileUser', 'profileUser')
      .leftJoinAndSelect('profileUser.profile', 'profile')
      .leftJoinAndSelect('profile.accessProfile', 'accessProfile')
      .leftJoinAndSelect('accessProfile.access', 'access')
      .leftJoin(
        (qb) =>
          qb
            .select('User.id', 'id')
            .addSelect('MAX(ss.Id)', 'smax')
            .from(User, 'User')
            .leftJoin('User.userStatus', 'ss')
            .groupBy('User.id'),
        'sm',
        'sm.id = User.id',
      )
      .leftJoin(
        'User.userStatus',
        'userStatus',
        'userStatus.id = sm.smax',
      )
      .leftJoin(
        'userStatus.userStatusType',
        'userStatusType',
      )
      .where('User.active = 1')
      .getMany()
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.createQueryBuilder('User')
      .select(['User.id', 'User.username', 'User.firstName', 'User.lastName', 'User.email'
        , 'User.dni', 'User.dateOfBirth', 'User.roles'])
      .leftJoinAndSelect('User.profileUser', 'profileUser')
      .leftJoinAndSelect('profileUser.profile', 'profile')
      .leftJoinAndSelect('profile.accessProfile', 'accessProfile')
      .leftJoinAndSelect('accessProfile.access', 'access')
      .where('User.id = :id', { id: id })
      .andWhere('User.active = 1')
      .getOne()
    if (!user) {
      return new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No existe un usuario con el id ${id} ingresado o esta dado de baja`,
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      return user;
    }
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.createQueryBuilder('User')
      .select(['User.id', 'User.username', 'User.firstName', 'User.lastName', 'User.email'
        , 'User.dni', 'User.dateOfBirth', 'User.roles'])
      .leftJoinAndSelect('User.profileUser', 'profileUser')
      .leftJoinAndSelect('profileUser.profile', 'profile')
      .leftJoinAndSelect('profile.accessProfile', 'accessProfile')
      .leftJoinAndSelect('accessProfile.access', 'access')
      .where('User.email = :email', { email: email })
      .andWhere('User.active = 1')
      .getOne()
    return user;

  }

  async findOneByEmailForNotification(email: string) {
    let user = await this.userRepository.createQueryBuilder('User')
      .select(['User.id', 'User.username', 'User.firstName', 'User.lastName', 'User.email'
        , 'User.dni', 'User.dateOfBirth', 'User.roles'])
      .leftJoinAndSelect('User.supplier', 'supplier')
      .leftJoinAndSelect('supplier.schedule', 'schedule')
      .leftJoinAndSelect('schedule.turn', 'turn')
      .leftJoinAndSelect('turn.alert', 'alert')
      .leftJoinAndSelect('turn.turnStatus', 'turnStatus')
      .leftJoinAndSelect('turnStatus.turnStatusType', 'turnStatusType')
      .where('User.email = :email', { email: email })
      .andWhere('User.active = 1')
      .andWhere('(turnStatusType.code = :code OR turnStatusType.code = :senaCode)', { code: 'TurnoReservado', senaCode: 'SeñaEsperandoAprobacion' })
      .getOne()

    if (!user) {
      user = await this.userRepository.createQueryBuilder('User')
        .select(['User.id', 'User.username', 'User.firstName', 'User.lastName', 'User.email'
          , 'User.dni', 'User.dateOfBirth', 'User.roles'])
        .leftJoinAndSelect('User.supplier', 'supplier')
        .leftJoinAndSelect('supplier.schedule', 'schedule')
        .leftJoinAndSelect('schedule.turn', 'turn')
        .leftJoinAndSelect('turn.alert', 'alert')
        .leftJoinAndSelect('turn.turnStatus', 'turnStatus')
        .leftJoinAndSelect('turnStatus.turnStatusType', 'turnStatusType')
        .where('User.email = :email', { email: email })
        .andWhere('User.active = 1')
        .getOne()
    }
    return user;

  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: updateUserDto.id, active: true }, relations: { profileUser: { profile: { accessProfile: { access: true } } } } });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `El usuario con ID= ${updateUserDto.id} no fue encontrado`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (updateUserDto.accesses) {
      console.log(updateUserDto.accesses);

      const yaTieneAccesos = [...new Set(user.profileUser[0].profile.accessProfile.map(accessProfile => accessProfile.access.code))];

      const accesosAgregar = [...new Set(updateUserDto.accesses.filter(accessCode => !yaTieneAccesos.includes(accessCode)))];
      const accesosEliminar = [...new Set(yaTieneAccesos.filter(accessCode => !updateUserDto.accesses.includes(accessCode)))];

      if (accesosAgregar.length > 0) {
        const accessCodesToAdd = new Set(accesosAgregar);

        const accessProfilesAgregar = await Promise.all(Array.from(accessCodesToAdd).map(async accessCode => {
          const accessProfile = new AccessProfile();
          accessProfile.profile = user.profileUser[0].profile;
          accessProfile.access = await this.entityManager.findOne(Access, { where: { code: accessCode } });
          return accessProfile;
        }));

        await this.entityManager.save(AccessProfile, accessProfilesAgregar);
      }

      if (accesosEliminar.length > 0) {
        const accessProfilesEliminar = await this.accessProfileRepository.createQueryBuilder('accessProfile')
          .leftJoinAndSelect('accessProfile.profile', 'profile')
          .leftJoinAndSelect('accessProfile.access', 'access')
          .where('profile.id = :profileId', { profileId: user.profileUser[0].profile.id })
          .andWhere('access.code IN (:...accessCodes)', { accessCodes: accesosEliminar })
          .getMany();

        console.log('accessProfilesEliminar: ', accessProfilesEliminar);
        // Filtrar accesosEliminar para incluir solo aquellos que ya existen en la base de datos
        const accessCodesToDelete = accessProfilesEliminar.map(accessProfile => accessProfile.access.code);

        const finalAccessesToDelete = accessCodesToDelete.filter(accessCode => !updateUserDto.accesses.includes(accessCode));
        console.log('accessCodesToDelete: ', accessCodesToDelete);
        console.log('finalAccessesToDelete: ', finalAccessesToDelete);

        // Ahora, elimina los accesos finales
        await this.accessProfileRepository.remove(accessProfilesEliminar.filter(accessProfile => finalAccessesToDelete.includes(accessProfile.access.code)));
      }
    }
    // Verifica si el usuario está intentando cambiar el username y si el nuevo valor es diferente
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      // Verifica si ya existe un usuario con el mismo nuevo username
      const isUsernameDuplicate = await this.validation(updateUserDto.username, null, null);

      if (isUsernameDuplicate) {
        return new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Ya existe un usuario con el nuevo username ingresado',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    // Verifica si el usuario está intentando cambiar el email y si el nuevo valor es diferente
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      // Verifica si ya existe un usuario con el mismo nuevo email
      const isEmailDuplicate = await this.validation(null, updateUserDto.email, null);

      if (isEmailDuplicate) {
        return new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Ya existe un usuario con el nuevo email ingresado',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    // Verifica si el usuario está intentando cambiar el dni y si el nuevo valor es diferente
    if (updateUserDto.dni && updateUserDto.dni !== user.dni) {
      // Verifica si ya existe un usuario con el mismo nuevo dni
      const isDniDuplicate = await this.validation(null, null, updateUserDto.dni);

      if (isDniDuplicate) {
        return new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Ya existe un usuario con el nuevo dni ingresado',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    // Verificar la contraseña antigua
    if (updateUserDto.oldPassword && !bcrypt.compareSync(updateUserDto.oldPassword, user.password)) { //
      console.error('Error: La contraseña antigua proporcionada no es válida');
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'La contraseña antigua proporcionada no es válida',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateUserDto.password) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    }
    // Si no hay duplicados en ninguno de los campos editados, procede con la actualización
    const updatedUser = await this.userRepository.preload({
      id: updateUserDto.id,
      ...updateUserDto,
    });

    if (updateUserDto.dateTo) {
      const newUserStatus = new UserStatus();
      newUserStatus.statusRegistrationDateTime = this.formatDate(new Date());
      newUserStatus.dateTo = updateUserDto.dateTo;
      newUserStatus.userStatusType = await this.validateTypeUserStatusLicencia();
      newUserStatus.user = updatedUser;
      await this.entityManager.save(UserStatus, newUserStatus);
    }

    let newPass = null
    if (updateUserDto?.password) {
      newPass = bcrypt.hashSync(updateUserDto.password, 10)
      updatedUser.password = newPass;
    }

    if ((updateUserDto.roles.includes('supplier')) && (!user.roles.includes('supplier'))) {
      const newProfileUser = new ProfileUser();
      newProfileUser.profile = await this.codeProfileSupplier();
      newProfileUser.user = updatedUser;
      updatedUser.profileUser.push(newProfileUser);
    } else if ((updateUserDto.roles.includes('client')) && (!user.roles.includes('client'))) {
      const newProfileUser = new ProfileUser();
      newProfileUser.profile = await this.codeProfileClient();
      newProfileUser.user = updatedUser; // Asignar el usuario actualizado aquí
      updatedUser.profileUser.push(newProfileUser); // Asignar el nuevo ProfileUser al usuario
    } else if ((updateUserDto.roles.includes('admin')) && (!user.roles.includes('admin'))) {
      const newProfileUser = new ProfileUser();
      newProfileUser.profile = await this.codeProfileAdmin();
      newProfileUser.user = updatedUser; // Asignar el usuario actualizado aquí
      updatedUser.profileUser.push(newProfileUser)// Asignar el nuevo ProfileUser al usuario
    }

    let userResult: any;
    await this.entityManager.transaction(async (transaction) => {
      try {
        userResult = await transaction.save(updatedUser);
        if ((!updateUserDto.roles.includes('supplier')) && (user.roles.includes('supplier'))) {
          const profile = await this.codeProfileSupplier();
          // Buscar el ProfileUser asociado al perfil y al usuario
          const profileUserToDelete = await this.profileUserRepository
            .createQueryBuilder('profileUser')
            .where('profileUser.profile = :profileId', { profileId: profile.id }) // Utiliza solo el valor id del perfil como parámetro
            .andWhere('profileUser.user = :userId', { userId: userResult.id }) // Utiliza solo el valor id del usuario como parámetro
            .getOne();
          // Si se encuentra el ProfileUser, eliminarlo
          if (profileUserToDelete) {
            await this.profileUserRepository.delete(profileUserToDelete.id); // Elimina el ProfileUser de la base de datos
          }
        } else if ((!updateUserDto.roles.includes('client')) && (user.roles.includes('client'))) {
          const profile = await this.codeProfileClient();
          // Buscar el ProfileUser asociado al perfil y al usuario
          const profileUserToDelete = await this.profileUserRepository
            .createQueryBuilder('profileUser')
            .where('profileUser.profile = :profileId', { profileId: profile.id }) // Utiliza solo el valor id del perfil como parámetro
            .andWhere('profileUser.user = :userId', { userId: userResult.id }) // Utiliza solo el valor id del usuario como parámetro
            .getOne();

          // Si se encuentra el ProfileUser, eliminarlo
          if (profileUserToDelete) {
            await this.profileUserRepository.delete(profileUserToDelete.id); // Elimina el ProfileUser de la base de datos
          }
        } else if ((!updateUserDto.roles.includes('admin')) && (user.roles.includes('admin'))) {
          const profile = await this.codeProfileAdmin();
          // Buscar el ProfileUser asociado al perfil y al usuario
          const profileUserToDelete = await this.profileUserRepository
            .createQueryBuilder('profileUser')
            .where('profileUser.profile = :profileId', { profileId: profile.id }) // Utiliza solo el valor id del perfil como parámetro
            .andWhere('profileUser.user = :userId', { userId: userResult.id }) // Utiliza solo el valor id del usuario como parámetro
            .getOne();
          if (profileUserToDelete) {
            await this.profileUserRepository.delete(profileUserToDelete.id); // Elimina el ProfileUser de la base de datos
          }
        }
        // delete userResult.password;
      } catch (error) {
        console.log(error);
        throw new DbException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
    delete userResult.profileUser;
    return {
      status: HttpStatus.OK,
      data: userResult,
    };
  }

  async updateStatus(id: number) {
    console.log(id);

    const userFound = await this.userRepository.findOne({ where: { id: id } })

    const newUserStatus = new UserStatus();
    newUserStatus.statusRegistrationDateTime = this.formatDate(new Date());
    newUserStatus.userStatusType = await this.validateTypeUserStatusActivo();
    newUserStatus.user = userFound;

    try {
      await this.entityManager.transaction(async (transaction) => {
        try {
          await transaction.save(newUserStatus);
        } catch (error) {
          console.log(error);
          throw new DbException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });
    } catch (error) {
      console.log(error);
      throw new DbException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.createQueryBuilder('User')
      .select(['User.id', 'User.username', 'User.firstName', 'User.lastName', 'User.email'
        , 'User.dni', 'User.dateOfBirth'])
      .where('User.id = :id', { id: updateUserDto.id })
      .andWhere('User.active = 1')
      .getOne()
    if (!user) {
      return new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No existe un usuario con el id ${updateUserDto.id} ingresado o ya esta dado de baja`,
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      user.active = false
      this.userRepository.save(user)
      return user;
    }

  }

  private newFormatDate(dateOfBirth: string) {
    // Comprueba si la fecha ya tiene el formato AAAA-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      return dateOfBirth; // No es necesario volver a formatear
    }

    // Si no tiene el formato, intenta formatearla
    const dateParts = dateOfBirth.split('-');
    if (dateParts.length === 3) {
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      return formattedDate;
    } else {
      throw new Error('Formato de fecha no válido');
    }
  }

  private formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  private padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

}
