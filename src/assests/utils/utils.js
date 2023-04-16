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

export {
    debounce,
    debouncePromise,
}

