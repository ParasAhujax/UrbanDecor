// const scroll = new LocomotiveScroll({
//     el: document.querySelector('#main'),
//     smooth: true
// });

function locomotiveAnimation(){
    gsap.registerPlugin(ScrollTrigger);

    // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

    const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
    });
    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);

    // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
        return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
        return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector("#main").style.transform
        ? "transform"
        : "fixed",
    });

    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();
}
locomotiveAnimation()

function navbarAnimation(){
    gsap.to("#navbar .links", {
        transform: "translateY(-100%)",
        opacity: 0,
        scrollTrigger: {
            trigger: "#page1",
            scroller: "#main",
            start: "top 0",
            end: "top -5%",
            scrub: true,
        },
    });
}
navbarAnimation();
    

function videoHoverAnimation(){
    const videoContainer = document.getElementById("video-container")
    const heading = document.querySelector(".heading-container");
    const scrollbtn = document.getElementById("scroll");

    function mouseEnter(){
        // scrollbtn.style.opacity = 1;
        // scrollbtn.style.scale = 1;
    
        gsap.to(scrollbtn,{       //gsap adds animation
            opacity : 1,
            scale : 1,
            zIndex:2
        })
    }
    function mouseLeave(){
        gsap.to(scrollbtn,{
            opacity : 0,
            scale : 0
        })
    }
    function mouseMove(detail){
        gsap.to(scrollbtn,{
            left:detail.x-80,
            top:detail.y-80
        })
    }
    videoContainer.addEventListener("mouseenter",mouseEnter)
    heading.addEventListener("mouseenter",mouseEnter)

    videoContainer.addEventListener("mouseleave",mouseLeave)
    heading.addEventListener("mouseleave",mouseLeave)

    videoContainer.addEventListener("mousemove",mouseMove)
    heading.addEventListener("mousemove",mouseMove)

    scrollbtn.addEventListener("click",function(){
        window.scrollY('100vh')
    })
    
}
videoHoverAnimation();

function loadAnimation(){
    const page2 = document.getElementById("page2");
    // gsap.from("#nav",{
    //     y:-100,
    //     opacity:0,
    //     delay:1.2,
    //     duration:0.9,
    //     stagger:0.2,
    // })
    gsap.from("#page1 h1",{
        y:100,
        opacity:0,
        delay:1.2,
        duration:0.9,
        stagger:0.2
    })
    gsap.from("#video-container",{
        y:1000,
        opacity:0,
        delay:0.3,
        duration:0.9,
    })
    
        // gsap.from("#page2 .elem1",{
        //     y:100,
        //     opacity:0,
        //     delay:0.5,
        //     duation:0.8,
        //     stagger:1.2
        // })
    
}
loadAnimation();

function cursorAnimation(){
    const cursor = document.getElementById("cursor");
    const page3 = document.getElementById("page3");
    
    document.addEventListener("mousemove",(details)=>{
        gsap.to(cursor,{
            left:details.x,
            top:details.y,
        })
    })
    document.querySelector("#page1").addEventListener("mouseenter",(details)=>{
        gsap.to("#cursor",{
            transform: `translate(-50%,-50%) scale(1)`
        })
    })   
}
cursorAnimation();
