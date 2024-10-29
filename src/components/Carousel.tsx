import clsx from "clsx";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import {
  forwardRef,
  ReactElement,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

gsap.registerPlugin(Draggable);

export type CarouselRef = {
  onPreviousClick: () => void;
  onNextClick: () => void;
};
type CarouselProps = {
  children: ReactElement<any, string | React.JSXElementConstructor<any>>[];
  className?: string;
  slideDelay?: number;
  slideDuration?: number;
  wrap?: boolean;
  [props: string]: any;
};

const Carousel = forwardRef<CarouselRef, CarouselProps>(
  (
    {
      children,
      className,
      slideDelay = 3,
      slideDuration = 2,
      wrap = true,
      ...props
    },
    ref
  ) => {
    const animateSlides = useRef<
      (direction: number, onComplete?: () => void) => void
    >(() => {});
    const slideContainerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      const eventDisposable: any[] = [];
      const slides = slideContainerRef.current
        ?.children as HTMLCollectionOf<HTMLElement>;

      if (!slides || slides.length <= 1) return;

      const ctx = gsap.context(() => {
        const numSlides = children.length;
        const progressWrap = gsap.utils.wrap(0, 1);
        const wrapX = gsap.utils.wrap(-100, (numSlides - 1) * 100);

        const proxy = document.createElement("div");
        let slideWidth = 0;
        let wrapWidth = 0;

        let slideAnimation = gsap.to({}, {});

        const snapX = (value: number) => {
          const snapped = gsap.utils.snap(slideWidth, value);
          return wrap
            ? snapped
            : gsap.utils.clamp(-slideWidth * (numSlides - 1), 0, snapped);
        };
        animateSlides.current = (
          direction: number,
          onComplete?: () => void
        ) => {
          timer.pause();
          slideAnimation.kill();
          const x = snapX(
            +gsap.getProperty(proxy, "x") + direction * slideWidth
          );

          slideAnimation = gsap.to(proxy, {
            x: x,
            duration: slideDuration,
            onUpdate: updateProgress,
            onComplete: () => {
              timer.restart(true);
              if (onComplete) onComplete();
            },
          });
        };

        const autoPlay = () => {
          if (
            draggable.isPressed ||
            draggable.isDragging ||
            draggable.isThrowing
          ) {
            timer.pause();
          } else {
            animateSlides.current(-1);
          }
        };
        const timer = gsap.delayedCall(slideDelay, autoPlay);

        const updateProgress = () => {
          animation.progress(
            progressWrap(+gsap.getProperty(proxy, "x") / wrapWidth)
          );
        };
        const updateDraggable = () => {
          timer.pause();
          slideAnimation.pause();
        };
        const resize = () => {
          const norm = +gsap.getProperty(proxy, "x") / wrapWidth || 0;

          slideWidth = slides[0].offsetWidth;
          wrapWidth = slideWidth * numSlides;

          if (!wrap)
            draggable.applyBounds({
              minX: -slideWidth * (numSlides - 1),
              maxX: 0,
            });

          gsap.set(proxy, { x: norm * wrapWidth });

          animateSlides.current(0);
          slideAnimation.progress(1);
        };

        // Make slides position horizontally concurrently
        gsap.set(slides, {
          xPercent: (i) => i * 100,
        });

        // Creates an animation that moves slides horizontally by their total width
        // and repeats infinitely and wraps position
        const animation = gsap.to(slides, {
          xPercent: "+=" + numSlides * 100,
          duration: 1,
          ease: "none",
          paused: true,
          repeat: -1,
          modifiers: {
            xPercent: wrapX,
          },
        });

        const draggable = new Draggable(proxy, {
          type: "x",
          trigger: slideContainerRef.current,
          onRelease: () => {
            const prevDuration = slideDuration;
            // eslint-disable-next-line react-hooks/exhaustive-deps
            slideDuration = 1;
            animateSlides.current(0, () => {
              slideDuration = prevDuration;
            });
          },
          onPress: updateDraggable,
          onDrag: () => {
            updateProgress();
          },
          snap: {
            x: snapX,
          },
        });

        resize();

        eventDisposable.push(window.addEventListener("resize", resize));
      });

      return () => {
        eventDisposable.forEach((event) => {
          event?.removeEventListener("resize");
        });
        ctx.revert();
      };
    }, [children, slideDelay, slideDuration, wrap]);

    useImperativeHandle(ref, () => ({
      onPreviousClick: () => {
        animateSlides.current(1);
      },
      onNextClick: () => {
        animateSlides.current(-1);
      },
    }));

    return (
      <div
        ref={slideContainerRef}
        className={clsx("size-full overflow-hidden flex-1 relative", className)}
        {...props}
      >
        {children.map((slides: any, index: number) => {
          return (
            <div key={index} className="size-full absolute top-0 left-0">
              {slides}
            </div>
          );
        })}
      </div>
    );
  }
);

export default Carousel;
