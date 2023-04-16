function debounce(func, wait=250) {
    let timeoutId;
    return function(...args) {
      const context = this;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
}

function debouncePromise(func, wait = 250) {
  let timeoutId;
  
  return function(...args) {
    const context = this;
    
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        resolve(func.apply(context, args));
      }, wait);
    });
  };
}


function getDateWithSuffixDay() {
    const date = new Date();
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const formattedDate = `${day}${suffix}, ${month} ${year}`;

    console.log(formattedDate);
    function getDaySuffix(day) {
      if (day >= 11 && day <= 13) {
        return 'th';
      }
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
          case 3:
            return 'rd';
            default:
              return 'th';
            }
          }
          
    return formattedDate;
}


export {
    debounce,
    debouncePromise,
    getDateWithSuffixDay,
}