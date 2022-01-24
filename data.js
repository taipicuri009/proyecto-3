export const sortData = (data, sortBy, sortOrder) => {
    const order = (sortOrder === 'asc') ? 1 : -1;
    if(sortBy == 'name' || sortBy == 'title'){
      return data.sort((a, b) => (a[sortBy] > b[sortBy] ? order: (-order)));
    }
    return data.sort((a, b) => (parseInt(a[sortBy]) > parseInt(b[sortBy]) ? order: (-order)));
  };
  
  export const filterDataByDirectorProducer = (data, condition) => {
    return data.filter(film => film.director === condition || film.producer === condition);
  };
  
  export const filterDataBy = (data, condition, value) => {
    return data.filter(film => film[condition] === value);
  };
  
  export const searchData = (data, condition, value) => {
    return data.filter(item => item[condition].toLowerCase().includes(value.toLowerCase()));
  }
  
  const deleteDataDuplicates = (data) => {
    return data.filter((item, index) => data.indexOf(item) === index);
  }
  
  export const getDataFilterBy = (data, condition) => {
    const dataFilters = data.map(item => item[condition]);
    return deleteDataDuplicates(dataFilters);
  }
  
  export const counterData = (data, condition, values) => {
    const counter = [];
    for(let value of values) {
      counter.push(filterDataBy(data, condition, value).length)
    }
    return counter;
  }
  
  export const getNamesDirectorProducer = (films) => {
    const namesDirectorProducer = [];
    films.forEach(film => {
        namesDirectorProducer.push(film.director, film.producer);
    });
    return deleteDataDuplicates(namesDirectorProducer);
  }