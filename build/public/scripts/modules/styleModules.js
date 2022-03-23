export function headerStyle() {
    const menus = document.querySelectorAll(".mainMenu");
    const boxes = document.querySelectorAll("nav > ul > div > li");
    for (let i = 0; i < menus.length; i++) {
        menus[i].addEventListener("mouseenter", (e) => { menus[i].style.backgroundColor = "#F2D244"; });
        boxes[i].addEventListener("mouseleave", (e) => { menus[i].style.backgroundColor = ""; });
    }
}
