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
      events: [
      ],
      dateClick: (info) => {
         console.log(info);
      },
   });
   calendar.render();

   return calendar;
}