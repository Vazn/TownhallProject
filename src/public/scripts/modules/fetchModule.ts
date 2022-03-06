export { queryControler };

async function queryControler(controler :string, options :Object) {
   const url :string = `http://localhost:8080/${controler}`;
   console.log("url : ", url)
   let answer = null;

   try {
      const response :Response = await fetch(url, options);

      answer = await response.json();
   } catch (e) {
      return null;
   }

   return answer;
}
