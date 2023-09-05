import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceAttendanceControlSheet } from "src/entities/serviceAttendanceControlSheet.entity";
import { Repository } from "typeorm";
import { ReportProjection } from "./dto/reportProjection.dto";
import { TypeService } from "src/type/type.service";
import { Group } from "src/entities/group.entity";
import { GroupSupplier } from 'src/entities/groupSupplier.entity';
import { Fee } from "src/entities/fee.entity";
import { ReportProjectionResponse } from "./dto/reportProyectionResponse.dto";
import { Professional } from "src/service-attendance-control-sheet/dto/professional.dto";
import { SupplierReportDto } from "./dto/supplierReport.dto";
import { Supplier } from "src/entities/supplier.entity";
import { Client } from "src/entities/client.entity";
import { Student } from "src/entities/student.entity";
import { GroupStudent } from "src/entities/groupStudent.entity";

@Injectable()
export class ReportService {

  private readonly logger = new Logger(ReportService.name)
  constructor(
    @InjectRepository(ServiceAttendanceControlSheet)
    private readonly serviceAttendanceControlSheetRepository: Repository<ServiceAttendanceControlSheet>,
    private typeService: TypeService,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Fee)
    private readonly feeRepository: Repository<Fee>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ){}

  async getProjectionReport(clientId: number, dateFrom: string, dateTo: string, statusId: number) {

    let newDateFrom: string = null
    let newDateTo: string = null

    if (!dateFrom) {
      let _newDateFrom = new Date()
      _newDateFrom.setDate(1)
      dateFrom = _newDateFrom.toLocaleDateString('es-ES')
    }

    if (!dateTo) {
      let _newDateTo = new Date()
      _newDateTo.setMonth(_newDateTo.getMonth() + 1)
      _newDateTo.setDate(0)
      dateTo = _newDateTo.toLocaleDateString('es-ES')
      
    }

    newDateFrom = this.setLocaleDate(dateFrom)
    newDateTo = this.setLocaleDate(dateTo)

    const feeStatusTypeActivo = await this.typeService.findTypeByCodeJust('FeeActivo')
    const groupSupplierStatusTypeActivo = await this.typeService.findTypeByCodeJust('GroupSupplierActivo')
    const feeSchemeAllType = await this.typeService.findTypeByCodeJust('FeeScheme*')
    const feeSchemeType = await this.typeService.findTypeByCode('FeeScheme')
    const feeModalityAllType = await this.typeService.findTypeByCodeJust('FeeModality*')
    const feeModalityType = await this.typeService.findTypeByCode('FeeModality')
    const feeSpecialCharacteristicType = await this.typeService.findTypeByCode('FeeSpecialCharacteristic')

    const group = await this.groupRepository
      .createQueryBuilder('Group')
      .select(['Group.id', 'Group.serviceCode'])
      .addSelect('GroupStatus.id')
      .addSelect('GroupStatusType.id')
      .addSelect('GroupStatusType.name')
      .addSelect('Client.id')
      .addSelect('CourseType.id')
      .addSelect('CourseType.name')
      .addSelect('ModalityType.id')
      .addSelect('ModalityType.name')
      .addSelect('SpecialFeatureType.id')
      .addSelect('SpecialFeatureType.name')
      .addSelect(['Enterprise.id', 'Enterprise.businessName'])
      .addSelect('GroupSupplier.id')
      .addSelect('GroupSupplierStatus.id')
      .addSelect(['GroupSupplierStatusType.id', 'GroupSupplierStatusType.name'])
      .addSelect('GroupSupplierStatus.id')
      .addSelect(['GroupClassSchedule.id', 'GroupClassSchedule.classFrom', 'GroupClassSchedule.classTo', 'ClassDayType.name'])
      .addSelect('Supplier.id')
      .addSelect(['Person.id', 'Person.name', 'Person.lastName'])
      .leftJoin(
        (qb) =>
          qb
            .select('Group.id', 'id')
            .addSelect('MAX(GroupStatus.Id)', 'max')
            .from(Group, 'Group')
            .leftJoin(
              'Group.groupStatus',
              'GroupStatus',
            )
            .groupBy('Group.id'),
        'gs',
        'gs.id = Group.id',
      )
      .leftJoin('Group.groupStatus', 'GroupStatus', 'GroupStatus.id = gs.max')
      .leftJoin('GroupStatus.groupStatusType', 'GroupStatusType')
      .leftJoin('Group.groupSupplier', 'GroupSupplier')
      .leftJoin('GroupSupplier.supplier', 'Supplier')
      .leftJoin('Supplier.person', 'Person')
      .leftJoin(
        (qb) =>
          qb
            .select('GroupSupplier.id', 'id')
            .addSelect('MAX(GroupSupplierStatus.Id)', 'max')
            .from(GroupSupplier, 'GroupSupplier')
            .leftJoin(
              'GroupSupplier.groupSupplierStatus',
              'GroupSupplierStatus',
            )
            .groupBy('GroupSupplier.id'),
        'gss',
        'gss.id = GroupSupplier.id',
      )
      .leftJoin('GroupSupplier.groupSupplierStatus', 'GroupSupplierStatus', 'GroupSupplierStatus.id = gss.max')
      .leftJoin('Group.groupClassSchedule', 'GroupClassSchedule')
      .leftJoin('GroupClassSchedule.classDayType', 'ClassDayType')
      .leftJoin('Group.client', 'Client')
      .leftJoin('Group.courseType','CourseType')
      .leftJoin('Group.modalityType','ModalityType')
      .leftJoin('Group.specialFeatureType','SpecialFeatureType')
      .leftJoin('Client.enterprise', 'Enterprise')
      .leftJoin('GroupSupplierStatus.groupSupplierStatusType', 'GroupSupplierStatusType')
      .where('GroupSupplierStatusType.id  = :groupSupplierStatusTypeActivo', { groupSupplierStatusTypeActivo: groupSupplierStatusTypeActivo.id })

    if (statusId) {
      group.andWhere('GroupStatusType.id  = :groupStatusTypeId', { groupStatusTypeId: statusId })
    }

    if (clientId) {
      group.andWhere('Enterprise.id = :clientId', { clientId: clientId })
    }

    // esta validación no corresponde
    // if(dateFrom) {
    //   group.andWhere('Group.StartDate  >= :groupStartDate', {groupStartDate: newDateFrom})
    // }

    // if(dateTo) {
    //   group.andWhere('Group.EndDate  <= :groupEndDate', {groupEndDate: newDateTo})
    // }



    const groupResponse: Group[] = await group.getMany()

    let projectionResponse: ReportProjectionResponse[] = []

    const promises = groupResponse.map(async (g) => {
      let schemee
      console.log('g',g)
      if (g?.courseType?.id) {
        schemee = feeSchemeType.find(o => o.name == g.courseType.name)
      }
      let modality
      if (g?.modalityType?.id) {
        modality = feeModalityType.find(o => o.name == g.modalityType.name)
      }
      let specialfeature
      if (g?.specialFeatureType?.id) {
        specialfeature = feeSpecialCharacteristicType.find(o => o.name == g?.specialFeatureType?.name)
      }

      const fc = await this.feeRepository
        .createQueryBuilder('Fee')
        .select(['Fee.id', 'Fee.valueFee'])
        .leftJoin(
          (qb) => qb
            .select('Fee.id', 'id')
            .addSelect('MAX(FeeStatus.Id)', 'max')
            .from(Fee, 'Fee')
            .leftJoin('Fee.feeStatus', 'FeeStatus')
            .groupBy('Fee.id'),
          'fs',
          'fs.id = Fee.id'
        )

        .leftJoin('Fee.feeStatus', 'FeeStatus', 'FeeStatus.id = fs.max')
        .leftJoin('FeeStatus.feeStatusType', 'FeeStatusType')
        .leftJoin('Fee.schemeType', 'SchemeType')
        .leftJoin('Fee.modalityType', 'ModalityType')
        .where('Fee.client = :client', { client: g.client.id })
        .andWhere('(SchemeType.id = :scheme or SchemeType.id = :schemeAll)',
          { scheme: schemee?.id, schemeAll: feeSchemeAllType.id })
        .andWhere('(ModalityType.id = :modality or ModalityType.id = :modalityAll)',
          { modality: modality?.id, modalityAll: feeModalityAllType.id })
        
        // if(dateFrom) {
        //   fc.andWhere('Fee.DateFrom  >= :feeDateFrom', {feeDateFrom: `${newDateFrom} 00:00:00`})
        // }
  
        // if(dateTo) {
        //   fc.andWhere('Fee.DateTo  <= :feeDateTo', {feeDateTo: `${newDateTo} 23:59:59`})
        // }

        // if(!dateFrom && !dateTo) {
          fc.andWhere('FeeStatusType.id = :feeStatusTypeActivo', { feeStatusTypeActivo: feeStatusTypeActivo.id })
        // }
        
        const feeClient = await fc.limit(1).getOne()

      const prof = g.groupSupplier[g.groupSupplier.length - 1]
      let feeProfessional = null

      if (prof?.supplier) {
        const fp = await this.feeRepository
          .createQueryBuilder('Fee')
          .select(['Fee.id', 'Fee.valueFee'])
          .leftJoin(
            (qb) => qb
              .select('Fee.id', 'id')
              .addSelect('MAX(FeeStatus.Id)', 'max')
              .from(Fee, 'Fee')
              .leftJoin('Fee.feeStatus', 'FeeStatus')
              .groupBy('Fee.id'),
            'fs',
            'fs.id = Fee.id'
          )

          .leftJoin('Fee.feeStatus', 'FeeStatus', 'FeeStatus.id = fs.max')
          .leftJoin('FeeStatus.feeStatusType', 'FeeStatusType')
          .leftJoin('Fee.schemeType', 'SchemeType')
          .leftJoin('Fee.modalityType', 'ModalityType')
          .where('Fee.supplier = :supplier', { supplier: prof.supplier.id })
          .andWhere('(SchemeType.id = :scheme or SchemeType.id = :schemeAll)',
            { scheme: schemee?.id, schemeAll: feeSchemeAllType.id })
          .andWhere('(ModalityType.id = :modality or ModalityType.id = :modalityAll)',
            { modality: modality?.id, modalityAll: feeModalityAllType.id })

        // if(dateFrom) {
        //   fp.andWhere('Fee.DateFrom  >= :feeDateFrom', {feeDateFrom: `${newDateFrom} 00:00:00`})
        // }
  
        // if(dateTo) {
        //   fp.andWhere('Fee.DateTo  <= :feeDateTo', {feeDateTo: `${newDateTo} 23:59:59`})
        // }

        // if(!dateFrom && !dateTo) {
          fp.andWhere('FeeStatusType.id = :feeStatusTypeActivo', { feeStatusTypeActivo: feeStatusTypeActivo.id })
        // }

        feeProfessional = await fp.limit(1).getOne()
      }

      let cantHorasPorGrupo: number = 0;
      let valorFacturado: any = 0;
      let costoFacturado: number = 0;

      // if(newDateFrom || newDateTo) {

      // filtro por los en los que se dictan clases en el curso
      const daysInRange: any[] = []
      const daysToFilter: any[] = []
      let billableDays: any[] = []
      let cantHorasPorDia: number = 0;

      // obtengo el calendario del curso con su carga horaria
      g.groupClassSchedule.map(classSchedule => {
        // console.log(`g.id ${g.serviceCode}: `, classSchedule)
        const hora1 = new Date(`${new Date().toISOString().substring(0, 10)} ${classSchedule?.classFrom}`) ?? null
        const hora2 = new Date(`${new Date().toISOString().substring(0, 10)} ${classSchedule?.classTo}`) ?? null
        cantHorasPorDia = (hora2.getTime() - hora1.getTime()) / 1000 / 60 / 60
        daysToFilter.push({ dayName: classSchedule.classDayType.name, hours: cantHorasPorDia })
      })

      // recupero los dias del rango consultado
      let currentDate = new Date(dateFrom);

      while (currentDate <= new Date(dateTo)) {
        const dayOfWeek = currentDate.toLocaleDateString('es-ES', { weekday: 'long' })
        const hours = daysToFilter.find(dayFilter => dayFilter.dayName.toLowerCase() == dayOfWeek.toLowerCase())
        daysInRange.push({ date: currentDate.toISOString().substring(0, 10), name: dayOfWeek, hours: hours?.hours });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // filtro los días del periodo facturado que corresponden a el calendario del grupo
      billableDays = daysInRange.filter(day => daysToFilter.some(dayFilter => dayFilter.dayName.toLowerCase() == day.name.toLowerCase()))
      billableDays.map(billable => {
        cantHorasPorGrupo += billable.hours
      })

      // TODO:
      // *** Aplicar filtro para feriados ***

      // console.log('daysToFilter',daysToFilter)
      // console.log('daysInRange',daysInRange)
      console.log('billableDays', billableDays)

      // } else {

      //   for (const cs of g.groupClassSchedule) {
      //     let cantHorasPorDia: number = 0;
      //     cantHorasPorDia = parseInt(cs.classTo) - parseInt(cs.classFrom);
      //     cantHorasPorGrupo += cantHorasPorDia;
      //   }
      // }

      if (feeClient?.valueFee) {
        valorFacturado = cantHorasPorGrupo * feeClient.valueFee;
      } else {
        valorFacturado = 'no tiene fee';
      }

      const actualSupplier: any = {
        professionalName: prof?.supplier.person ? `${prof.supplier.person?.name} ${prof.supplier.person?.lastName}` : '',
        professionalCost: feeProfessional?.valueFee ?? 0,
        professionalPay: feeProfessional?.valueFee ? cantHorasPorGrupo * feeProfessional.valueFee : 0
      }

      costoFacturado = valorFacturado != 'no tiene fee' ? valorFacturado - actualSupplier.professionalPay : 0

      projectionResponse.push({
        enterprise: g.client?.enterprise?.businessName,
        serviceCode: g.serviceCode,
        status: g.groupStatus[0]?.groupStatusType?.name,
        qtyHours: cantHorasPorGrupo,
        clientFee: feeClient?.valueFee ?? 0,
        billedToClient: valorFacturado,
        professional: actualSupplier.professionalName,
        professionalFee: actualSupplier.professionalCost,
        professionalCost: actualSupplier.professionalPay,
        billedLessCost: costoFacturado
      });
    })

    await Promise.all(promises)
    return projectionResponse
  }

  private setLocaleDate(date: string) {
    const yearFrom = date.includes('/') ? date.split('/')[2] : date.split('-')[0]
    const monthFrom = date.includes('/') ? date.split('/')[1] : date.split('-')[1]
    const dayFrom = date.includes('/') ? date.split('/')[0] : date.split('-')[2]
    return `${yearFrom}-${this.completeDayMonth(monthFrom)}-${this.completeDayMonth(dayFrom)}`
  }

  private completeDayMonth(dateNumber:string) {
    return +dateNumber < 10 ? `0${+dateNumber}` : dateNumber
  }

  async getIntegrativeReport(
    clientId: number,
    dateFrom: string,
    dateTo: string
  ) {
    const clientStatusTypeActive = await this.typeService.findTypeByCodeJust('ClienteActivo')
    // const groupStatusTypeActive = await this.typeService.findTypeByCodeJust('ClienteActivo')
    const groupStudentStatusTypeInactive = await this.typeService.findTypeByCodeJust('GroupStudentInactivo')
    const attendanceTypeP = await this.typeService.findTypeByCodeJust('AttendanceP')
    const attendanceTypeAJ = await this.typeService.findTypeByCodeJust('AttendanceAJ')
    const groupSupplierStatusTypeActivo = await this.typeService.findTypeByCodeJust('GroupSupplierActivo')
    const client = await this.clientRepository.createQueryBuilder('Client')
      .select([
        'Client.id', 'Enterprise.id', 'Enterprise.businessName',
        'Group.id', 'GroupStudent.id', 'Student.id', 'Student.fileNumber',
        'StudentPerson.id', 'StudentPerson.name', 'StudentPerson.lastName',
        'GroupLanguage.id', 'GroupLanguage.name', 'Group.startDate',
        'StudentStatus.id', 'StudentStatus.statusRegistrationDateTime',
        'Group.serviceCode', 'GroupProgress.id', 'LanguageLevel.id',
        'LanguageLevel.levelName', 'ProyectType.id', 'ProyectType.name',
        'Student.division', 'ModalityType.id', 'ModalityType.name',
        'ClientCostCenter.id', 'ClientCostCenter.name',
        'StudentLanguage.id', 'StudentLanguageLevel.id',
        'StudentLanguageLevel.levelName', 'AttendanceType.name',
        'EnterpriseHeadquarter.id', 'EnterpriseHeadquarter.address',
        'Material.description', 'StudentPerson.email',
        'StudentPerson.phoneNumber', 'GroupSupplier.id', 'Supplier.id',
        'SupplierPerson.id', 'SupplierPerson.name', 'SupplierPerson.lastName',
        'GroupStudentStatus.id', 'GroupStudentStatus.statusRegistrationDateTime',
        'GroupStudentAttendance.id', 'GroupStudentAttendance.classAttendanceYear',
        'GroupStudentAttendance.classAttendanceMonth',
        'GroupStudentAttendance.classAttendanceDay', 'AttendanceType.id',
      ])
      .leftJoin(
        (qb) =>
          qb
            .select('Client.id', 'id')
            .addSelect('MAX(cs.id)', 'max')
            .from(Client, 'Client')
            .leftJoin('Client.clientStatus', 'cs')
            .groupBy('Client.id'),
        'csm',
        'csm.id = Client.id',
      )
      .leftJoin('Client.clientStatus', 'ClientStatus', 'ClientStatus.id = csm.max')
      .leftJoin('ClientStatus.clientStatusType', 'ClientStatusType')
      .leftJoin('Client.enterprise', 'Enterprise')
      .leftJoin('Client.group', 'Group')
      .leftJoin('Group.groupStatus', 'GroupStatus')
      .leftJoin('GroupStatus.groupStatusType', 'GroupStatusType')
      .leftJoin('Group.groupSupplier', 'GroupSupplier')
      .leftJoin('Group.enterpriseHeadquarter', 'EnterpriseHeadquarter')
      .leftJoin('GroupSupplier.supplier', 'Supplier')
      .leftJoin('Supplier.person', 'SupplierPerson')
      .leftJoin(
        (qb) =>
          qb
            .select('GroupSupplier.id', 'id')
            .addSelect('MAX(gs.id)', 'max')
            .from(GroupSupplier, 'GroupSupplier')
            .leftJoin('GroupSupplier.groupSupplierStatus', 'gs')
            .leftJoin('gs.groupSupplierStatusType', 'gsst')
            .where('gsst.id = :gst', { gst: groupSupplierStatusTypeActivo.id })
            .groupBy('GroupSupplier.id'),
        'gsusm',
        'gsusm.id = GroupSupplier.id',
      )
      .leftJoin('GroupSupplier.groupSupplierStatus', 'GroupSupplierStatus', 'GroupSupplierStatus.id = gsusm.max')
      .leftJoin('Group.groupStudent', 'GroupStudent')
      .leftJoin('GroupStudent.student', 'Student')
      .leftJoin('GroupStudent.groupStudentAttendance', 'GroupStudentAttendance')
      .leftJoin('GroupStudentAttendance.attendanceType', 'AttendanceType')
      .leftJoin(
        (qb) =>
          qb
            .select('GroupStudent.id', 'id')
            .addSelect('MAX(gss.id)', 'max')
            .from(GroupStudent, 'GroupStudent')
            .leftJoin('GroupStudent.groupStudentStatus', 'gss')
            .leftJoin('gss.groupStudentStatusType', 'gst')
            .where('gst.id = :sid', { sid: groupStudentStatusTypeInactive.id })
            .groupBy('GroupStudent.id'),
        'gssm',
        'gssm.id = GroupStudent.id',
      )
      .leftJoin('GroupStudent.groupStudentStatus', 'GroupStudentStatus', 'GroupStudentStatus.id = gssm.max')
      .leftJoin('Student.person', 'StudentPerson')
      .leftJoin(
        (qb) =>
          qb
            .select('Student.id', 'id')
            .addSelect('MIN(ss.id)', 'min')
            .from(Student, 'Student')
            .leftJoin('Student.studentStatus', 'ss')
            .groupBy('Student.id'),
        'ssm',
        'ssm.id = Student.id',
      )
      .leftJoin('Student.studentStatus', 'StudentStatus', 'StudentStatus.id = ssm.min')
      .leftJoin('Student.clientCostCenter', 'ClientCostCenter')
      .leftJoin('Group.groupLanguage', 'GroupLanguage')
      .leftJoin(
        (qb) =>
          qb
            .select('Student.id', 'id')
            .addSelect('l.id', 'lid')
            .addSelect('MAX(sl.id)', 'max')
            .from(Student, 'Student')
            .leftJoin('Student.studentLanguage', 'sl')
            .leftJoin('sl.languageLevel', 'll')
            .leftJoin('ll.language', 'l')
            .groupBy('Student.id')
            .addGroupBy('l.id'),
        'slm',
        'slm.id = Student.id and slm.lid = GroupLanguage.id',
      )
      .leftJoin('Student.studentLanguage', 'StudentLanguage', 'StudentLanguage.id = slm.max')
      .leftJoin('StudentLanguage.languageLevel', 'StudentLanguageLevel')
      .leftJoin(
        (qb) =>
          qb
            .select('Group.id', 'id')
            .addSelect('MAX(gp.id)', 'max')
            .from(Group, 'Group')
            .leftJoin('Group.groupProgress', 'gp')
            // .where('gp.startDate > :dateFrom', { dateFrom })
            // .andWhere('gp.startDate < :dateTo', { dateTo })
            .groupBy('Group.id'),
        'gpm',
        'gpm.id = Group.id',
      )
      .leftJoin('Group.groupProgress', 'GroupProgress', 'GroupProgress.id = gpm.max')
      .leftJoin('GroupProgress.languageLevel', 'LanguageLevel')
      .leftJoin('GroupProgress.groupProgressProyectType', 'ProyectType')
      .leftJoin('GroupProgress.material', 'Material')
      .leftJoin('Group.modalityType', 'ModalityType')
      .where('Client.id = :client', { client: clientId })
      .andWhere('ClientStatusType.id = :clientStatusTypeActive', { clientStatusTypeActive: clientStatusTypeActive.id })
      .andWhere('GroupStatus.statusRegistrationDateTime > :dateFrom', { dateFrom })
      .andWhere('GroupStatus.statusRegistrationDateTime < :dateTo', { dateTo })
      // .andWhere('GroupStatusType.id = :groupStatusTypeActive', { groupStatusTypeActive: groupStatusTypeActive.id })
      .getOne()
    //TODO: Hs reales
    // client.group[0].enterpriseHeadquarter.address
    const res: any = []
    if (client) {
      const groups: any = client.group
      for (let i = 0; i <= client.group.length; i++) {
        if (groups[i]?.groupStudent) {
          const numberOfStudent = groups[i].groupStudent.length
          groups[i] = { ...groups[i], numberOfStudent }
          const students = groups[i].groupStudent
          let real = 0
          let relativo = 0
          if (students) {
            for (let t = 0; t <= students.length; t++) {
              let totalattendancereal = 0
              let totalattendancerelativo = 0
              if (students[t]) {
                if (students[t].groupStudentAttendance) {
                  for (const at of students[t].groupStudentAttendance) {
                    if (at.attendanceType.id == attendanceTypeP.id) {
                      totalattendancereal += 1
                      totalattendancerelativo += 1
                    }
                    if (at.attendanceType.id == attendanceTypeAJ.id) {
                      totalattendancerelativo += 1
                    }
                  }
                  real = totalattendancereal / students[t].groupStudentAttendance.length
                  relativo = totalattendancerelativo / students[t].groupStudentAttendance.length
                  const suppliers = []
                  if(groups[i].groupSupplier.length > 0){
                    for(const gs of groups[i].groupSupplier){
                      suppliers.push(gs.supplier.person.name + gs.supplier.person.lastName)
                    }
                  }
                  students[t] = {
                    ...students[t],
                    real, relativo,
                    groupLanguage: groups[i].groupLanguage?.name,
                    groupStartDate: groups[i].startDate,
                    groupServiceCode: groups[i].serviceCode,
                    groupCurrentLevel: groups[i].groupProgress[0].languageLevel?.levelName,
                    hsReal: 0,
                    project: groups[i].groupProgress[0].groupProgressProyectType?.name,
                    modality: groups[i].modalityType?.name,
                    numberOfStudent,
                    address: groups[i].enterpriseHeadquarter?.address,
                    material: groups[i].groupProgress[0].material?.name,
                    groupSupplier: suppliers.join(', ')
                  }
                  res.push(students[t])
                }
              }
            }
          }
        }
      }
      client.group = groups
    }
    return res
  }

  private getDaysInRange(startDate: Date, endDate: Date, daysInRange: any[]) {

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.toLocaleDateString('es-ES', { weekday: 'long' })
      daysInRange.push({ date: currentDate.toISOString().substring(0, 10), name: dayOfWeek });
      currentDate.setDate(currentDate.getDate() + 1);
    }

  }

  

  async getReportSupplier(supplierReportDto: SupplierReportDto){

    const allSuppliers = await this.supplierRepository
    .createQueryBuilder('Supplier')
    .select('Supplier.id')
    .addSelect(['Person.id', 'Person.name', 'Person.lastName'])
    .addSelect('GroupSupplier.id')
    .addSelect('Group.id')
    .addSelect(['GroupClassSchedule.id','GroupClassSchedule.classFrom', 'GroupClassSchedule.classTo'])
    .addSelect(['ClassDayType.id', 'ClassDayType.name'])
    .leftJoin('Supplier.person', 'Person')
    .leftJoin('Supplier.groupSupplier', 'GroupSupplier')
    .leftJoin('GroupSupplier.group', 'Group')
    .leftJoin('Group.groupClassSchedule', 'GroupClassSchedule')
    .leftJoin('GroupClassSchedule.classDayType', 'ClassDayType')
    .getMany()


    let finalArray = []
    for (const supplier of allSuppliers) {
      let lunes: any = 
      {'dia': 'Lunes', supplier,'07:00': 1, '07:30': 1, '08:00': 1, '08:30': 1, '09:00': 1, '09:30': 1, '10:00': 1, '10:30': 1, '11:00': 1, 
      '11:30': 1, '12:00': 1, '12:30': 1, '13:00': 1, '13:30': 1, '14:00': 1, '14:30': 1, '15:00': 1, '15:30': 1, '16:00': 1,
      '16:30': 1, '17:00': 1, '17:30': 1, '18:00': 1, '18:30': 1, '19:00': 1, '19:30': 1, '20:00': 1}

      let martes: any = 
      {'dia': 'Martes', supplier,'07:00': 1, '07:30': 1, '08:00': 1, '08:30': 1, '09:00': 1, '09:30': 1, '10:00': 1, '10:30': 1, '11:00': 1, 
      '11:30': 1, '12:00': 1, '12:30': 1, '13:00': 1, '13:30': 1, '14:00': 1, '14:30': 1, '15:00': 1, '15:30': 1, '16:00': 1,
      '16:30': 1, '17:00': 1, '17:30': 1, '18:00': 1, '18:30': 1, '19:00': 1, '19:30': 1, '20:00': 1}

      let miercoles: any = 
      {'dia': 'Miércoles', supplier,'07:00': 1, '7:30': 1, '08:00': 1, '08:30': 1, '09:00': 1, '09:30': 1, '10:00': 1, '10:30': 1, '11:00': 1, 
      '11:30': 1, '12:00': 1, '12:30': 1, '13:00': 1, '13:30': 1, '14:00': 1, '14:30': 1, '15:00': 1, '15:30': 1, '16:00': 1,
      '16:30': 1, '17:00': 1, '17:30': 1, '18:00': 1, '18:30': 1, '19:00': 1, '19:30': 1, '20:00': 1}

      let jueves: any = 
      {'dia': 'Jueves', supplier,'07:00': 1, '07:30': 1, '08:00': 1, '08:30': 1, '09:00': 1, '09:30': 1, '10:00': 1, '10:30': 1, '11:00': 1, 
      '11:30': 1, '12:00': 1, '12:30': 1, '13:00': 1, '13:30': 1, '14:00': 1, '14:30': 1, '15:00': 1, '15:30': 1, '16:00': 1,
      '16:30': 1, '17:00': 1, '17:30': 1, '18:00': 1, '18:30': 1, '19:00': 1, '19:30': 1, '20:00': 1}

      let viernes: any = 
      {'dia': 'Viernes', supplier,'07:00': 1, '07:30': 1, '08:00': 1, '08:30': 1, '09:00': 1, '09:30': 1, '10:00': 1, '10:30': 1, '11:00': 1, 
      '11:30': 1, '12:00': 1, '12:30': 1, '13:00': 1, '13:30': 1, '14:00': 1, '14:30': 1, '15:00': 1, '15:30': 1, '16:00': 1,
      '16:30': 1, '17:00': 1, '17:30': 1, '18:00': 1, '18:30': 1, '19:00': 1, '19:30': 1, '20:00': 1}

      finalArray.push(lunes, martes, miercoles, jueves, viernes)

      if(supplier?.groupSupplier?.group?.groupClassSchedule){
        for (const gcs of supplier.groupSupplier.group.groupClassSchedule) {
          if(gcs.classDayType.name == 'Lunes'){

            let interval: boolean = false
            for (const key of Object.keys(lunes)) {
              if(key == gcs.classFrom){
                interval = true
                lunes[`${gcs.classFrom}`] = 0
              }  
              if(key == gcs.classTo){
                interval = false
                lunes[`${gcs.classFrom}`] = 0
              }
              if(interval == true){
                lunes[key] = 0
              }
            }             
          }
          else if(gcs.classDayType.name == 'Martes'){
            let interval: boolean = false
            for (const key of Object.keys(martes)) {
              if(key == gcs.classFrom){
                interval = true
                martes[`${gcs.classFrom}`] = 0
              }  
              if(key == gcs.classTo){
                interval = false
                martes[`${gcs.classFrom}`] = 0
              }
              if(interval == true){
                martes[key] = 0
              }
            }   
          }else if(gcs.classDayType.name == 'Miércoles'){
            let interval: boolean = false
            for (const key of Object.keys(miercoles)) {
              if(key == gcs.classFrom){
                interval = true
                miercoles[`${gcs.classFrom}`] = 0
              }  
              if(key == gcs.classTo){
                interval = false
                miercoles[`${gcs.classFrom}`] = 0
              }
              if(interval == true){
                miercoles[key] = 0
              }
            }   
          }else if(gcs.classDayType.name == 'Jueves'){
            let interval: boolean = false
            for (const key of Object.keys(jueves)) {
              if(key == gcs.classFrom){
                interval = true
                jueves[`${gcs.classFrom}`] = 0
              }  
              if(key == gcs.classTo){
                interval = false
                jueves[`${gcs.classFrom}`] = 0
              }
              if(interval == true){
                jueves[key] = 0
              }
            }   
          }else if(gcs.classDayType.name == 'Viernes'){
            let interval: boolean = false
            for (const key of Object.keys(viernes)) {
              if(key == gcs.classFrom){
                interval = true
                viernes[`${gcs.classFrom}`] = 0
              }  
              if(key == gcs.classTo){
                interval = false
                viernes[`${gcs.classFrom}`] = 0
              }
              if(interval == true){
                viernes[key] = 0
              }
            }   
          }
        }
      }
      

    }

    return finalArray
  }
}