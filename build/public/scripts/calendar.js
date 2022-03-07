var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { postTextForm } from './modules/formModules.js';
import { FullCalendar } from "./node_modules/fullcalendar/main.js";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const calendar = yield initCalendar();
    postTextForm("eventCreate", () => calendar.refetchEvents());
}))();
function initCalendar() {
    return __awaiter(this, void 0, void 0, function* () {
        FullCalendar.globalLocales.push({
            code: "fr",
            week: {
                dow: 1,
                doy: 4,
            },
            buttonText: {
                prev: "Précédent",
                next: "Suivant",
                today: "Aujourd'hui",
                year: "Année",
                month: "Mois",
                week: "Semaine",
                day: "Jour",
                list: "Planning",
            },
            weekText: "Sem.",
            allDayText: "Toute la journée",
            moreLinkText: "en plus",
            noEventsText: "Aucun événement à afficher",
        });
        const calendarEl = document.getElementById("calendar");
        const calendar = new FullCalendar.Calendar(calendarEl, {
            locale: "fr",
            initialView: "dayGridMonth",
            initialDate: new Date(Date.now()),
            eventSources: [
                {
                    url: '/getEvents',
                }
            ],
            events: [],
            dateClick: (info) => {
                console.log(info);
            },
        });
        calendar.render();
        return calendar;
    });
}
