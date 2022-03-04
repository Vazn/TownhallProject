var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export { queryControler };
function queryControler(controler, data = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `http://localhost:8080/${controler}`;
        let answer = null;
        try {
            const response = yield fetch(url, {
                method: "POST",
                body: data
            });
            answer = yield response.json();
            console.log("fetchModule answer : ", answer);
        }
        catch (e) {
            console.error(e);
            return null;
        }
        return answer;
    });
}
