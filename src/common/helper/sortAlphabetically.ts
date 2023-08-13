export const sortAlpha = (arr: any[]) => {
    const ordered = arr.sort((a, b) => {
       if ((a.name === "Otro" || a.name === "Otros" || a.name === 'Otra') && (b.name !== "Otro" || b.name !== "Otros" || b.name !== 'Otra')) {
         return -1; // a comes first
       } else if ((a.name !== "Otro" || a.name !== "Otros" || a.name !== 'Otra') && (b.name === "Otro" || b.name === "Otros"|| b.name === 'Otra')) {
         return 1; // b comes first
       } else {
         return a.name?.localeCompare(b.name); // sort alphabetically
       }
     });
   return ordered;
  }

  export const sortAlphaForSupplier = (arr: any[]) => {
    const ordered = arr.sort((a, b) => {
       if ((a.person?.name === "Otro" || a.person?.name === "Otros" || a.person?.name === 'Otra') && (b.person?.name !== "Otro" || b.person?.name !== "Otros" || b.person?.name !== 'Otra')) {
         return -1; // a comes first
       } else if ((a.person?.name !== "Otro" || a.person?.name !== "Otros" || a.person?.name !== 'Otra') && (b.person?.name === "Otro" || b.person?.name === "Otros"|| b.person?.name === 'Otra')) {
         return 1; // b comes first
       } else {
         return a.person?.name?.localeCompare(b.person?.name); // sort alphabetically
       }
     });
   return ordered;
  }
  
  export const sortAlphaDescr = (arr: any[]) => {
    const ordered = arr.sort((a, b) => {
       if ((a.description === "Otro" || a.description === "Otros") && (b.description !== "Otro" || b.description === "Otros")) {
         return -1; // a comes first
       } else if ((a.description !== "Otro" || a.description === "Otros") && (b.description === "Otro" || b.description === "Otros")) {
         return 1; // b comes first
       } else {
         return a.description?.localeCompare(b.description); // sort alphabetically
       }
     });
   return ordered;
  }
  
  export const sortAlphaBN = (arr: any[]) => {
    const ordered = arr.sort((a, b) => {
       if ((a.businessName === "Otro" || a.businessName === "Otros") && (b.businessName !== "Otro" || b.businessName === "Otros")) {
         return -1; // a comes first
       } else if ((a.businessName !== "Otro" || a.businessName === "Otros") && (b.businessName === "Otro" || b.businessName === "Otros")) {
         return 1; // b comes first
       } else {
         return a.businessName?.localeCompare(b.businessName); // sort alphabetically
       }
     });
   return ordered;
  }

  export const sortAlphaLN = (arr: any[]) => {
    const ordered = arr.sort((a, b) => {
       if ((a.levelName === "Otro" || a.levelName === "Otros") && (b.levelName !== "Otro" || b.levelName === "Otros")) {
         return -1; // a comes first
       } else if ((a.levelName !== "Otro" || a.levelName === "Otros") && (b.levelName === "Otro" || b.levelName === "Otros")) {
         return 1; // b comes first
       } else {
         return a.levelName?.localeCompare(b.levelName); // sort alphabetically
       }
     });
   return ordered;
  }
  
  // export const sortAlphaBankBranch = (arr: any[]) => {
  //   const ordered = arr.sort(
  //     (a, b) => {
  //     if ((a.bankBranch === "Otro" || a.bankBranch === "Otros") && (b.bankBranch !== "Otro" || b.bankBranch === "Otros")) {
  //        return -1; // a comes first
  //      } else if ((a.bankBranch !== "Otro" || a.bankBranch === "Otros") && (b.bankBranch === "Otro" || b.bankBranch === "Otros")) {
  //        return 1; // b comes first
  //      } else {
  //        return a.bankBranch?.localeCompare(b.bankBranch);  // sort alphabetically
  //      }
  //    }
  //    );
  //    ordered.forEach(elements => {
  //     if (elements.bankBranch !== null) {
  //      ordered.push(elements);
  //     }
  //    });
  //    return ordered; 
  // }
  
  // export const sortPercent = (arr: any[]) => {
  //   arr.forEach((element, index) => {
  //     if (element.percentageOfPerception === null || element.percentageOfPerception === undefined || element.percentageOfPerception === 'null' || element.percentageOfPerception === 'NULL' ) {
  //       arr.splice(index, 1);
  //     }
  //    });
  //   const ordered = arr.sort((a, b) => {
  //     if (a.percentageOfPerception < b.percentageOfPerception) {
  //       return -1; // a comes first
  //     } else if (a.percentageOfPerception > b.percentageOfPerception) {
  //       return 1; // b comes first
  //     } else {
  //       return 0; // no sorting needed
  //     }
  //   });
  //   ordered.forEach((element, index) => {
  //     if (element.percentageOfPerception === null || element.percentageOfPerception === undefined || element.percentageOfPerception === 'null' || element.percentageOfPerception === 'NULL' ) {
  //      ordered.splice(index, 1);
  //     }
  //    });
  //    ordered.forEach((element, index) => {
  //     if (element.percentageOfPerception === null || element.percentageOfPerception === undefined || element.percentageOfPerception === 'null' || element.percentageOfPerception === 'NULL' ) {
  //      ordered.splice(index, 1);
  //     }
  //    });
  //    ordered.forEach((element, index) => {
  //     if (element.percentageOfPerception === null || element.percentageOfPerception === undefined || element.percentageOfPerception === 'null' || element.percentageOfPerception === 'NULL' ) {
  //      ordered.splice(index, 1);
  //     }
  //    });
  //  return ordered;
  // }