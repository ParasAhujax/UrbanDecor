const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});

function videoContainer(){
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
            left:detail.x-55,
            top:detail.y-70
        })
    }
    videoContainer.addEventListener("mouseenter",mouseEnter)
    heading.addEventListener("mouseenter",mouseEnter)

    videoContainer.addEventListener("mouseleave",mouseLeave)
    heading.addEventListener("mouseleave",mouseLeave)

    videoContainer.addEventListener("mousemove",mouseMove)
    heading.addEventListener("mousemove",mouseMove)
    
}
videoContainer();

function loadAnimation(){
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
}
loadAnimation();