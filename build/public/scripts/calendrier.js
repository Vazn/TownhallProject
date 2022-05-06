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
import { queryControler } from './modules/fetchModule.js';
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
            events: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const data = yield queryControler([`getEvents/`], {
                        method: "GET",
                    });
                    for (let event of data)
                        event.title = event.title.replace(/_/g, ' ');
                    return data;
                });
            },
            eventColor: '#FAE790',
            eventTextColor: "#3f3f3f",
            eventMouseEnter: () => {
                document.body.style.cursor = "pointer";
            },
            eventMouseLeave: () => {
                document.body.style.cursor = "default";
            },
            eventClick: (info) => {
                const modal = document.querySelector(".modal");
                const modalContent = document.querySelector(".modalContent");
                const title = info.event.title;
                const description = info.event.extendedProps.description;
                const header = document.createElement("header");
                modalContent.innerHTML = "";
                const titleElement = document.createElement("h3");
                titleElement.textContent = title;
                const separatorElement = document.createElement("hr");
                separatorElement.setAttribute("class", "littleHr");
                separatorElement.style.margin = "1% 0 1% 0";
                const paragraphElement = document.createElement("p");
                paragraphElement.textContent = description;
                const trashIcon = document.createElement("img");
                trashIcon.setAttribute("src", "/images/trash.svg");
                trashIcon.classList.add("trash");
                trashIcon.classList.add("icons");
                header.append(titleElement);
                header.append(trashIcon);
                modalContent.append(header);
                modalContent.append(separatorElement);
                modalContent.append(paragraphElement);
                modal.style.visibility = "visible";
                modal.style.opacity = "100";
                const h2 = document.querySelector("#adminSection input[name=title]");
                const textarea = document.querySelector("#adminSection textarea");
                h2.setAttribute("value", title);
                textarea.textContent = description;
                window.addEventListener("mousedown", (e) => __awaiter(this, void 0, void 0, function* () {
                    if (e.target === modal) {
                        modal.style.opacity = '0';
                        modal.style.visibility = 'hidden';
                    }
                    else if (e.target === trashIcon) {
                        modal.style.opacity = '0';
                        modal.style.visibility = 'hidden';
                        const success = yield queryControler([`deleteEvent/`, title], {
                            method: "GET",
                        });
                        calendar.refetchEvents();
                    }
                }));
            },
        });
        calendar.render();
        return calendar;
    });
}
