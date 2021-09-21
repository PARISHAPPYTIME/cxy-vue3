// import { createApp } from "./src/runtime-core/index";
// import App from "./App";

// console.log(123);
// const app = createApp(App);

// app.mount(document.querySelector("#app"));

import { effect } from "./src/reactivity/src/effect";

const myEffect = effect(
	function () {
		console.log(123456789);
	},
	{
		scheduler: () => {
			console.log(this);
		},
		test: function () {
			console.log(this);
		},
		onStop() {
			console.log("----- 关闭的时候会执行这个");
		},
	}
);

console.log(myEffect);
console.log(myEffect.effect);
console.log("再执行一次----");
myEffect();

myEffect.effect.onStop();
myEffect.effect.onStop();
myEffect.effect.onStop();
myEffect.effect.onStop();
myEffect.effect.onStop();
