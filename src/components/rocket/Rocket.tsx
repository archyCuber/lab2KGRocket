import React, { useEffect, useRef, useState } from "react";

const BACKGROUND_WIDTH = document.body.clientWidth;
const BACKGROUND_HEIGHT = document.body.clientHeight - 50;
const ROCKET_WIDTH = 200;
const ROCKET_HEIGHT = 500;

export const Rocket = () => {
  const [power, setPower] = useState(2);

  const canvasBackground = useRef({} as HTMLCanvasElement);
  const canvasRocket = useRef({} as HTMLCanvasElement);
  const interval = useRef<any>();

  const renderRoof = (ctxRocket: CanvasRenderingContext2D) => {
    ctxRocket.moveTo(0, 100);
    ctxRocket.lineTo(100, 0);
    ctxRocket.moveTo(200, 100);
    ctxRocket.lineTo(100, 0);
    ctxRocket.moveTo(0, 100);
    ctxRocket.lineTo(200, 100);
  };

  const renderBody = (ctxRocket: CanvasRenderingContext2D) => {
    ctxRocket.moveTo(0, 100);
    ctxRocket.lineTo(0, 350);
    ctxRocket.moveTo(200, 100);
    ctxRocket.lineTo(200, 350);
    ctxRocket.moveTo(0, 350);
    ctxRocket.lineTo(200, 350);
    ctxRocket.moveTo(150, 160);
    ctxRocket.arc(100, 162.5, 50, 0, (Math.PI / 180) * 360);
    ctxRocket.moveTo(150, 280);
    ctxRocket.arc(100, 280, 50, 0, (Math.PI / 180) * 360);
  };

  const renderFire2 = (
    ctxRocket: CanvasRenderingContext2D,
    startX: number,
    heightAnother: number,
    count: number
  ) => {
    const step = Math.floor(ROCKET_WIDTH / count / 2);
    let currentStep = startX;
    while (count) {
      renderFirePart(ctxRocket, currentStep, step, heightAnother);
      currentStep += step * 2;
      count--;
    }
  };

  const renderFirePart = (
    ctxRocket: CanvasRenderingContext2D,
    currentStep: number,
    step: number,
    minHeight: number
  ) => {
    ctxRocket.moveTo(currentStep, minHeight);
    currentStep += step;
    ctxRocket.lineTo(currentStep, ROCKET_HEIGHT);
    ctxRocket.moveTo(currentStep, ROCKET_HEIGHT);
    currentStep += step;
    ctxRocket.lineTo(currentStep, minHeight);
  };

  const renderRocket = (ctxRocket: CanvasRenderingContext2D) => {
    renderRoof(ctxRocket);
    renderBody(ctxRocket);
    renderFire2(ctxRocket, 0, 350, power);
  };

  const scale = (
    step: number,
    resize: number,
    canvasRocket: React.MutableRefObject<HTMLCanvasElement>,
    canvasBackground: React.MutableRefObject<HTMLCanvasElement>
  ) => {
    canvasRocket.current.width = 205;
    canvasRocket.current.height = 500;
    const ctxFigure = canvasRocket.current.getContext("2d")!;
    ctxFigure.beginPath();
    ctxFigure.strokeStyle = "red";
    renderRocket(ctxFigure);
    ctxFigure.stroke();
    const ctxMain = canvasBackground.current.getContext("2d")!;
    // ctxMain.drawImage(
    //   canvasRocket.current,
    //   Math.floor(BACKGROUND_WIDTH / 2 - ROCKET_WIDTH / 2),
    //   step || BACKGROUND_HEIGHT - ROCKET_HEIGHT
    // );
    const cw = canvasRocket.current.width;
    const ch = canvasRocket.current.height;
    const tempCanvas = document.createElement("canvas");
    const tctx = tempCanvas.getContext("2d")!;
    tempCanvas.width = cw;
    tempCanvas.height = ch;
    tctx.drawImage(canvasRocket.current, 0, 0);
    canvasRocket.current.width *= resize;
    canvasRocket.current.height *= resize;
    const fixX = Math.round((200 - canvasRocket.current.width) / 2);
    console.log("DD fix", fixX);
    const ctx = canvasRocket.current.getContext("2d")!;
    ctx.drawImage(tempCanvas, 0, 0, cw, ch, 0, 0, cw * resize, ch * resize);
    ctxMain.clearRect(0, 0, BACKGROUND_WIDTH, BACKGROUND_HEIGHT);
    ctxMain.drawImage(
      canvasRocket.current,
      Math.floor(BACKGROUND_WIDTH / 2 - ROCKET_WIDTH / 2) + fixX,
      step || BACKGROUND_HEIGHT - ROCKET_HEIGHT
    );
  };

  const render = (step?: number) => {
    canvasRocket.current = document.createElement("canvas");
    canvasBackground.current.width = BACKGROUND_WIDTH;
    canvasBackground.current.height = BACKGROUND_HEIGHT;
    canvasRocket.current.width = ROCKET_WIDTH;
    canvasRocket.current.height = ROCKET_HEIGHT;
    const ctxRocket = canvasRocket.current.getContext("2d")!;
    const backgroundCtx = canvasBackground.current.getContext("2d")!;
    backgroundCtx.beginPath();
    backgroundCtx.rect(0, 0, BACKGROUND_WIDTH, BACKGROUND_HEIGHT);
    backgroundCtx.fillStyle = "black";
    backgroundCtx.fill();
    ctxRocket.beginPath();
    ctxRocket.strokeStyle = "red";
    renderRocket(ctxRocket);
    ctxRocket.stroke();
    backgroundCtx.drawImage(
      canvasRocket.current,
      Math.floor(BACKGROUND_WIDTH / 2 - ROCKET_WIDTH / 2),
      step || BACKGROUND_HEIGHT - ROCKET_HEIGHT
    );
  };

  useEffect(() => {
    render();
  }, [power]);

  return (
    <div>
      <canvas ref={canvasBackground}></canvas>
      <button
        onClick={() => {
          if (!power) {
            return;
          }
          let length = BACKGROUND_HEIGHT - ROCKET_HEIGHT;
          let resize = 1;
          interval.current = setInterval(() => {
            length -= 10;
            if (resize > 0.1) {
              resize -= 0.02;
            } else {
              clearInterval(interval.current);
            }
            scale(length, resize, canvasRocket, canvasBackground);
            if (length > BACKGROUND_HEIGHT + 500) {
              clearInterval(interval.current);
            }
          }, 200 / power);
        }}
      >
        start
      </button>
      <input
        placeholder={"Power"}
        value={power}
        onChange={(e) =>
          setPower(+e.target.value > 100 ? 100 : +e.target.value)
        }
      />
    </div>
  );
};
