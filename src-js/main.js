import { sayHello } from "./greet.js";
function showHello(divName, name) {
    const elt = document.getElementById(divName);
    elt.innerText = sayHello(name);
}
showHello("greeting", "TypeScript");
