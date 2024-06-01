import "babel-polyfill";

import "./scss/style.scss";
import { el, setChildren } from "redom";
import Form from "./Form.js";

setChildren(
  window.document.body,
  el(
    "section",
    { className: "hero" },
    el(
      "div",
      { className: "container" },
      el("h1", { className: "text-reset hero__title" }, "Форма оплаты"),
      new Form()
    )
  )
);
