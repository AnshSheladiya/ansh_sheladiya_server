
async function getPaginationObject(datas, pageNumber, pageSize,totalResults) {
    const totalPages = Math.ceil(totalResults / pageSize);

    const currentPage = pageNumber > totalPages ? totalPages : pageNumber;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalResults);
    
    return {
        current: currentPage,
        total_pages: totalPages,
        total_results: totalResults,
        size: pageSize,
    };
  }
  module.exports=getPaginationObject;
//   // Example usage:
//   const data = [{}, {}, {}, /* ... */];
  
//   const pageNumber = 2;
//   const pageSize = 5;
  
//   const paginationObject = getPaginationObject(data, pageNumber, pageSize);
//   console.log(paginationObject);
  