var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function burgerMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const button = document.querySelector("#burgerButton");
        const dropdown = document.querySelector("#burgerDropdown");
        let clicked = 1;
        button.addEventListener("click", (e) => {
            if (clicked) {
                dropdown.style.display = "block";
                clicked = 0;
            }
            else {
                dropdown.style.display = "none";
                clicked = 1;
            }
        });
    });
}
