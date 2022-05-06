export async function burgerMenu() {
   const button :HTMLElement = document.querySelector("#burgerButton");
   const dropdown :HTMLElement = document.querySelector("#burgerDropdown");
   let clicked = 1;

   button.addEventListener("click", (e) => {
      if (clicked) {
         dropdown.style.display = "block";
         clicked = 0;
      } else {
         dropdown.style.display = "none";

         clicked = 1;
      }
   });
}