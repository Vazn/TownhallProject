import { postTextForm } from './modules/formModules.js';
import { FullCalendar } from "./node_modules/fullcalendar/main.js";

( async () => {

   const calendar :FullCalendar = await initCalendar();
   postTextForm("eventCreate", () => calendar.refetchEvents());

})();

async function initCalendar() {
   FullCalendar.globalLocales.push({
      code: "fr",
      week: {
         dow: 1, // Monday is the first day of the week.
         doy: 4, // The week that contains Jan 4th is the first week of the year.
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
   const calendarEl :HTMLElement = document.getElementById("calendar");
   const calendar :FullCalendar = new FullCalendar.Calendar(calendarEl, {
      locale: "fr",
      initialView: "dayGridMonth",
      initialDate: new Date(Date.now()),
      eventSources: [
         {
           url: '/getEvents',
         }
      ],
      events: [],
      eventColor: '#FAE790',
      eventTextColor: "#3f3f3f",
      eventMouseEnter: () => {
         document.body.style.cursor = "pointer";
      },
      eventMouseLeave: () => {
         document.body.style.cursor = "default";
      },
      eventClick: (info) => {
         const modal :HTMLElement = document.querySelector(".modal");
         const modalContent :HTMLElement = document.querySelector(".modalContent");

         const title = info.event.title;
         const description = info.event.extendedProps.description;

         modalContent.innerHTML = "";
         const titleElement = document.createElement("h3");
         titleElement.textContent = title;
         const separatorElement = document.createElement("hr"); /* littleHr */
         separatorElement.setAttribute("class", "littleHr");
         separatorElement.style.margin = "1% 0 1% 0";
         const paragraphElement = document.createElement("p");
         paragraphElement.textContent = description;

         modalContent.append(titleElement);
         modalContent.append(separatorElement);
         modalContent.append(paragraphElement);

			modal.style.visibility = "visible";
			modal.style.opacity = "100";

         window.addEventListener("mousedown", (e) => {					
            if (e.target === modal) {
               modal.style.opacity = '0';
               modal.style.visibility = 'hidden';
            }
         });
      },
   });
   calendar.render();

   return calendar;
}