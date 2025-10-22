import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./SuccessStory.css";

gsap.registerPlugin(ScrollTrigger);

const stories = [
  {
    name: "Dr. Amina Rahman",
    quote:
      "Through MediCamp, I witnessed how a small act of kindness can change lives. When I first volunteered, I met families who had never seen a doctor before. Their smiles and gratitude reminded me why I chose medicine. Over time, these camps became more than a mission — they became a movement of compassion, unity, and hope. I firmly believe that access to healthcare is not a privilege but a right, and MediCamp stands as proof that together we can make a difference in even the remotest corners of our country. Every time I return from a camp, I feel more inspired to serve, more grounded in purpose, and deeply grateful to be part of this journey.",
  },
  {
    name: "Nafisul Islam",
    quote:
      "Being part of MediCamp has taught me how powerful community effort can be. I joined as a logistics volunteer, but soon I realized how each of us, no matter our role, contributes to something much larger. I’ve seen doctors working late into the night, students organizing equipment, and villagers helping each other. It’s not just about medical treatment — it’s about dignity and humanity. When people feel cared for, they regain hope. I learned that change doesn’t require a superhero; it needs teamwork, empathy, and the courage to act. MediCamp showed me that when we stand together, no goal is too big and no village too far.",
  },
  {
    name: "Farhana Yasmin",
    quote:
      "At first, I volunteered for MediCamp because I wanted to gain experience in healthcare management. But what I gained was far beyond professional growth. I met mothers who walked miles for check-ups, children who smiled even in pain, and doctors who treated patients like family. Those days taught me that impact doesn’t come from resources alone — it comes from intent and heart. MediCamp has changed how I see service. Every camp is a reminder that we all have the power to make someone’s day better, to heal with words, and to give without expecting anything in return. I am proud to be a part of this mission of care and compassion.",
  },
];

const SuccessStorySwipe = () => {
  const component = useRef(null);
  const panels = useRef([]);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let allowScroll = true;
      let scrollTimeout = gsap
        .delayedCall(1, () => (allowScroll = true))
        .pause();
      let currentIndex = 0;

      // z-index set
      gsap.set(panels.current, { zIndex: (i) => panels.current.length - i });

      // handle panel scroll animation
      function gotoPanel(index, isScrollingDown) {
        if (
          (index === panels.current.length && isScrollingDown) ||
          (index === -1 && !isScrollingDown)
        ) {
          intentObserver.disable(); // resume native scroll
          return;
        }

        allowScroll = false;
        scrollTimeout.restart(true);

        const target = isScrollingDown
          ? panels.current[currentIndex]
          : panels.current[index];

        gsap.to(target, {
          yPercent: isScrollingDown ? -100 : 0,
          duration: 0.75,
          ease: "power2.inOut",
        });

        currentIndex = index;
      }

      // ScrollTrigger observer
      let intentObserver = ScrollTrigger.observe({
        type: "wheel,touch",
        onUp: () => allowScroll && gotoPanel(currentIndex - 1, false),
        onDown: () => allowScroll && gotoPanel(currentIndex + 1, true),
        tolerance: 10,
        preventDefault: true,
      });
      intentObserver.disable();

      // Pin section setup
      ScrollTrigger.create({
        trigger: ".swipe-section",
        pin: true,
        start: "top top",
        end: "+=200",
        onEnter: (self) => {
          if (intentObserver.isEnabled) return;
          self.scroll(self.start + 1);
          intentObserver.enable();
        },
        onEnterBack: (self) => {
          if (intentObserver.isEnabled) return;
          self.scroll(self.end - 1);
          intentObserver.enable();
        },
      });

      // Cleanup
      return () => {
        intentObserver.kill();
        ScrollTrigger.killAll();
      };
    }, component);

    return () => ctx.revert();
  }, []);

  return (
    <div className="py-12 bg-black text-white" ref={component}>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#00E5FF] px-4">
        Success Stories
      </h2>

      <div className="swipe-section">
        {stories.map((story, index) => (
          <section
            key={index}
            className="panel flex flex-col items-center justify-center text-center bg-white rounded-xl shadow-xl text-black p-10"
            ref={(el) => (panels.current[index] = el)}
          >
            <h3 className="text-2xl font-bold mb-4 text-[#007FFF]">
              {story.name}
            </h3>
            <p className="italic mb-4 text-gray-700 leading-relaxed">
              "{story.quote}"
            </p>
            <p className="text-[#00E5FF] font-semibold">{story.camp}</p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default SuccessStorySwipe;
