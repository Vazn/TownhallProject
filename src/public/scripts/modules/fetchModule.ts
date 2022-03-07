export { queryControler };

async function queryControler(args :Array<string>, options :Object) {
   let url :string = `http://localhost:8080/`;
   let answer = null;

   for (let arg of args) url += arg.trim().replace(/ /g,'_');
   console.log("url : ", url);
   
   try {
      const response :Response = await fetch(url, options);
      answer = await response.json();
   } catch (e) {
      return null;
   }

   return answer;
}
