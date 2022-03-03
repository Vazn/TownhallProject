export { queryControler };

async function queryControler(controler: string, data: FormData = null) {
   const url: string = `http://localhost:8080/${controler}`;
   let answer = null;

   try {
      const response: Response = await fetch(url, {
         method: "POST",
         body: data,
      });

      answer = await response.json();
      console.log("fetchModule answer : ", answer);
   } catch (e) {
      console.error(e);
      return null;
   }

   return answer;
}
