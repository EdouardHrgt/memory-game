<template>
  <div class="container">
    <span class="loader"></span>
    <span class="loader-2"></span>
  </div>
</template>

<style scoped>
.container {
  position: absolute;
  z-index: 50;
  display: grid;
  place-content: center;
  background-color: var(--clr-dark-gray);
  inset: 0;
}
.loader {
  width: 160px;
  height: 185px;
  position: relative;
  background: #fff;
  border-radius: 100px 100px 0 0;
}
.loader:after {
  content: '';
  position: absolute;
  width: 100px;
  height: 125px;
  left: 50%;
  top: 25px;
  transform: translateX(-50%);
  background-image: radial-gradient(circle, #000 48%, transparent 55%), radial-gradient(circle, #000 48%, transparent 55%),
    radial-gradient(circle, #fff 30%, transparent 45%), radial-gradient(circle, #000 48%, transparent 51%),
    linear-gradient(#000 20px, transparent 0), linear-gradient(#cfecf9 60px, transparent 0),
    radial-gradient(circle, #cfecf9 50%, transparent 51%), radial-gradient(circle, #cfecf9 50%, transparent 51%);
  background-repeat: no-repeat;
  background-size: 16px 16px, 16px 16px, 10px 10px, 42px 42px, 12px 3px, 50px 25px, 70px 70px, 70px 70px;
  background-position: 25px 10px, 55px 10px, 36px 44px, 50% 30px, 50% 85px, 50% 50px, 50% 22px, 50% 45px;
  animation: faceLift 1s linear infinite alternate;
}
.loader:before {
  content: '';
  position: absolute;
  width: 140%;
  height: 125px;
  left: -20%;
  top: 0;
  background-image: radial-gradient(circle, #fff 48%, transparent 50%), radial-gradient(circle, #fff 48%, transparent 50%);
  background-repeat: no-repeat;
  background-size: 65px 65px;
  background-position: 0px 12px, 145px 12px;
  animation: earLift 1s linear infinite alternate;
}
p {
  font-size: 18px;
  color: var(--clr-snow-white);
  opacity: 0.7;
  text-align: center;
  padding-top: 0.7rem;
}

@keyframes faceLift {
  0% {
    transform: translateX(-60%);
  }
  100% {
    transform: translateX(-30%);
  }
}
@keyframes earLift {
  0% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(0px);
  }
}

/*-- END loader 1 --*/
.loader-2,
.loader-2:before,
.loader-2:after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  animation-fill-mode: both;
  animation: bblFadInOut 1.1s infinite ease-in-out;
}
.loader-2 {
  color: #fff;
  font-size: 7px;
  position: relative;
  margin-inline: auto;
  text-indent: -9999em;
  transform: translateZ(0);
  animation-delay: -0.16s;
}
.loader-2:before,
.loader-2:after {
  content: '';
  position: absolute;
  top: 0;
}
.loader-2:before {
  left: -3.5em;
  animation-delay: -0.32s;
}
.loader-2:after {
  left: 3.5em;
}

@keyframes bblFadInOut {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
</style>
