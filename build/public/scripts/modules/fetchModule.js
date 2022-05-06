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
function queryControler(args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = `http://localhost:8080/`;
        let answer = null;
        for (let arg of args)
            url += arg.trim().replace(/ /g, '_');
        console.log("url : ", url);
        try {
            const response = yield fetch(url, options);
            answer = yield response.json();
        }
        catch (e) {
            return null;
        }
        return answer;
    });
}
