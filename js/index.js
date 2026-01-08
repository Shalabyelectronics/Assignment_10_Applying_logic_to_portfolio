// ^ Write your JavaScript code here

// SCrollSpy Functionality
const navScrollEvent = () => {
  const allSections = document.querySelectorAll("section"); //It will return nodes list

  document.addEventListener("scroll", () => {
    for (const section of allSections) {
      if (section) {
        const elementStart = section.offsetTop - 184; // 88 + 96 is the height of the navbar itself so if the top of the element is 100px from the page in ower browser that mean from zero to 100px but as we have fixed navbar it will come over the element start so that why we substract -88px the navbar height.
        const elementEnd = section.offsetTop + section.offsetHeight - 184; // offsetTop it gives us the position between the top of the page the the stet edge of the element and offsetHeight will give us the height of the element it self so if the element top is 0 and its height is 100px so the element end will be 100px.
        let sectionID = section.getAttribute("id");
        let navLink = document.querySelector(`a[href="#${sectionID}"]`);
        if (navLink) {
          if (window.scrollY > elementStart && window.scrollY < elementEnd) {
            navLink.classList.add("active");
          } else {
            navLink.classList.remove("active");
          }
        }
      }
    }
  });
};

navScrollEvent();

// Dark and light Mode

const darkModeToggle = () => {
  const darkModeToggleBtn = document.querySelector("#theme-toggle-button");
  const htmlElement = document.querySelector("html");
  darkModeToggleBtn.addEventListener("click", () => {
    if (htmlElement.classList.contains("dark")) {
      htmlElement.classList.replace("dark", "light");
      localStorage.setItem("theme", "light");
    } else {
      htmlElement.classList.replace("light", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
};

darkModeToggle();

// Navs and tabs
const navsAndTabs = () => {
  // First I want to select all navs btns inside its container that hold portfolio-filters id
  const navsParent = document.querySelector("#portfolio-filters");
  // Second I will loop throw navsParent Children and use the event object to console log its data-filter valu
  for (const navBtn of navsParent.children) {
    navBtn.addEventListener("click", (event) => {
      const activeStyles = [
        "active",
        "bg-linear-to-r",
        "from-primary",
        "to-secondary",
        "text-white",
        "hover:shadow-lg",
        "hover:shadow-primary/50",
      ];

      const inactiveStyles = [
        "bg-white",
        "dark:bg-slate-800",
        "text-slate-600",
        "dark:text-slate-300",
        "border",
        "border-slate-300",
        "dark:border-slate-700",
        "hover:bg-slate-100",
        "dark:hover:bg-slate-700",
      ];
      for (const navBtn of navsParent.children) {
        if (navBtn.classList.contains("active")) {
          navBtn.classList.remove(...activeStyles);
          navBtn.classList.add(...inactiveStyles);
          navBtn.setAttribute("aria-pressed", "false");
        }
      }
      event.target.classList.add(...activeStyles);
      event.target.classList.remove(...inactiveStyles);
      event.target.setAttribute("aria-pressed", "true");
      // Now we need to filter the projects based its category

      const projectsParent = document.querySelector("#portfolio-grid");
      const showStyle =
        "transition: opacity 0.3s, transform 0.3s; opacity: 1; transform: scale(1); display: block;";
      const hideStyle =
        "transition: opacity 0.3s, transform 0.3s; opacity: 0; transform: scale(0.8); display: none;";
      for (const project of projectsParent.children) {
        if (event.target.getAttribute("data-filter") === "all") {
          project.style.display = "block";
          setTimeout(() => {
            project.style.transition = "opacity 0.3s, transform 0.3s";
            project.style.opacity = "1";
            project.style.transform = "scale(1)";
          }, 10);
        } else {
          if (
            event.target.getAttribute("data-filter") ===
            project.getAttribute("data-category")
          ) {
            project.style.display = "block";
            setTimeout(() => {
              project.style.transition = "opacity 0.3s, transform 0.3s";
              project.style.opacity = "1";
              project.style.transform = "scale(1)";
            }, 10);
          } else {
            project.style.display = "none";
            setTimeout(() => {
              project.style.transition = "opacity 0.3s, transform 0.3s";
              project.style.opacity = "0";
              project.style.transform = "scale(0.8)";
            }, 300);
          }
        }
      }
    });
  }
};

navsAndTabs();

// Carousal
function Carousal() {
  const nextBtn = document.querySelector("#next-testimonial");
  const prevBtn = document.querySelector("#prev-testimonial");
  const carousalContainer = document.querySelector("#testimonials-carousel");
  const carousalItems = document.querySelectorAll(".testimonial-card");
  const indicatorsContainer = document.querySelector("div[role='tablist']");

  let currentItemsShowing,
    maxIndex,
    carousalItemWidth,
    numberOfIndicators,
    carousalIndicatorsBtns,
    activeIndicatorBtnIndex;
  let counter = 0;

  nextBtn.addEventListener("click", () => carousalItemsSlideControl(1));
  prevBtn.addEventListener("click", () => carousalItemsSlideControl(-1));

  function currentCarousalItemsShowing() {
    const carousalContainerWidth =
      carousalContainer.getBoundingClientRect().width;
    const carousalItemWidth = carousalItems[0].getBoundingClientRect().width;
    return Math.floor(carousalContainerWidth / carousalItemWidth);
  }

  function createCarousalIndicator() {
    for (let i = 0; i < numberOfIndicators; i++) {
      const indicatorBtn = document.createElement("button");
      indicatorBtn.classList.add(
        "carousel-indicator",
        "w-3",
        "h-3",
        "rounded-full",
        "bg-slate-400",
        "bg-accent",
        "transition-all",
        "duration-300",
        "hover:scale-125",
        "cursor-pointer"
      );
      indicatorBtn.setAttribute("data-index", `${i}`);
      indicatorBtn.setAttribute("role", "tab");
      indicatorBtn.setAttribute("aria-label", `التوصية ${i}`);
      indicatorBtn.setAttribute("aria-selected", "false");
      indicatorBtn.setAttribute("type", "button");
      indicatorsContainer.append(indicatorBtn);
    }
  }

  function setCarousalIndicatorEventListenner() {
    carousalIndicatorsBtns.forEach((indicatorBtn) => {
      indicatorBtn.addEventListener("click", (event) => {
        activeIndicatorBtnIndex = Number(
          event.target.getAttribute("data-index")
        );
        counter = Math.min(
          activeIndicatorBtnIndex * currentItemsShowing,
          maxIndex
        );
        renderCarousalUI();
      });
    });
  }

  function carousalItemsSlideControl(direction) {
    counter += direction;

    if (counter > maxIndex) {
      counter = 0;
    } else if (counter < 0) {
      counter = maxIndex;
    }
    activeIndicatorBtnIndex = Math.floor(counter / currentItemsShowing);
    renderCarousalUI();
  }

  function renderCarousalUI() {
    const slideDistance = Math.ceil(counter * carousalItemWidth);
    carousalContainer.style.transform = `translateX(${slideDistance}px)`;

    carousalIndicatorsBtns.forEach((carousalIndicatorBtn) => {
      carousalIndicatorBtn.classList.remove("active");
      carousalIndicatorBtn.setAttribute("aria-selected", "false");
    });

    carousalIndicatorsBtns[activeIndicatorBtnIndex].classList.add("active");
    carousalIndicatorsBtns[activeIndicatorBtnIndex].setAttribute(
      "aria-selected",
      "true"
    );
  }

  function init() {
    currentItemsShowing = currentCarousalItemsShowing();
    maxIndex = carousalItems.length - currentItemsShowing;
    carousalItemWidth = carousalItems[0].getBoundingClientRect().width;
    numberOfIndicators = Math.ceil(carousalItems.length / currentItemsShowing);
    indicatorsContainer.innerHTML = "";
    createCarousalIndicator();
    carousalIndicatorsBtns = document.querySelectorAll(".carousel-indicator");
    counter = 0;
    activeIndicatorBtnIndex = Math.floor(counter / currentItemsShowing);
    setCarousalIndicatorEventListenner();
    renderCarousalUI();
  }
  window.addEventListener("resize", init);
  init();
}
Carousal();

// CustomizeHomePage
const settingSideBar = document.querySelector("#settings-sidebar");
const customizationBtn = document.querySelector("#settings-toggle");
function customizeHomePage() {
  const closeSideBarBtn = document.querySelector("#close-settings");
  const fontSwitcherBtns = document.querySelectorAll(".font-option");
  const fontsOptions = ["font-alexandria", "font-cairo", "font-tajawal"];

  function fontSwitcher() {
    fontSwitcherBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        for (const fontClass of fontsOptions) {
          if (document.body.classList.contains(fontClass)) {
            document.body.classList.remove(fontClass);
          }
        }

        fontSwitcherBtns.forEach((switchBtn) => {
          switchBtn.classList.remove("active", "border-primary");
          switchBtn.setAttribute("aria-checked", "false");
          switchBtn.classList.add("border-slate-200", "dark:border-slate-700");
          const checkmark = switchBtn.querySelector("div");
          if (checkmark) {
            checkmark.classList.remove("opacity-100");
            checkmark.classList.add("opacity-0");
          }
        });
        e.currentTarget.classList.remove(
          "border-slate-200",
          "dark:border-slate-700"
        );
        e.currentTarget.classList.add("active", "border-primary");
        e.currentTarget.setAttribute("aria-checked", "true");
        const activeCheckmark = e.currentTarget.querySelector("div");
        if (activeCheckmark) {
          activeCheckmark.classList.remove("opacity-0");
          activeCheckmark.classList.add("opacity-100");
        }
        document.body.classList.add(
          `font-${e.currentTarget.getAttribute("data-font")}`
        );
        localStorage.setItem(
          "selectedFont",
          e.currentTarget.getAttribute("data-font")
        );
      });
    });
  }

  function changeThemColor() {
    const colorContainer = document.querySelector("#theme-colors-grid");
    const themeColors = [
      { name: "Default Indigo", primary: "#6366f1", secondary: "#8b5cf6" },
      { name: "Blue Ocean", primary: "#3b82f6", secondary: "#06b6d4" },
      { name: "Emerald Jungle", primary: "#10b981", secondary: "#34d399" },
      { name: "Amber Orange", primary: "#f59e0b", secondary: "#ea580c" },
      { name: "Rose Pink", primary: "#ec4899", secondary: "#f43f5e" },
      { name: "Purple Haze", primary: "#8b5cf6", secondary: "#d946ef" },
      { name: "Red Danger", primary: "#ef4444", secondary: "#f87171" },
      { name: "Cyan Sky", primary: "#06b6d4", secondary: "#3b82f6" },
    ];

    const buttonsHTML = themeColors
      .map(
        (color) => `
    <button 
      class="theme-color-btn w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-slate-200 dark:border-slate-700 hover:border-primary shadow-sm" 
      title="${color.name}" 
      data-primary="${color.primary}" 
      data-secondary="${color.secondary}" 
      style="background: linear-gradient(135deg, ${color.primary}, ${color.secondary});"
      type="button"
    >
    </button>
  `
      )
      .join("");

    colorContainer.innerHTML = buttonsHTML;
    colorContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".theme-color-btn");
      if (btn) {
        const primary = btn.getAttribute("data-primary");
        const secondary = btn.getAttribute("data-secondary");
        document.documentElement.style.setProperty("--color-primary", primary);
        document.documentElement.style.setProperty(
          "--color-secondary",
          secondary
        );
        const themeData = { primary, secondary };
        localStorage.setItem("selectedTheme", JSON.stringify(themeData));
        document.querySelectorAll(".theme-color-btn").forEach((b) => {
          b.classList.remove("border-primary", "scale-110");
          b.classList.add("border-slate-200", "dark:border-slate-700");
        });
        btn.classList.remove("border-slate-200", "dark:border-slate-700");
        btn.classList.add("border-primary", "scale-110");
      }
    });
  }

  customizationBtn.addEventListener("click", toggleMenuState);
  closeSideBarBtn.addEventListener("click", toggleMenuState);
  fontSwitcher();
  changeThemColor();
}

function toggleMenuState() {
  settingSideBar.classList.toggle("translate-x-full");
  settingSideBar.classList.toggle("translate-x-0");

  const isExpanding = customizationBtn.getAttribute("aria-expanded") === "true";
  customizationBtn.setAttribute("aria-expanded", !isExpanding);
  if (isExpanding) {
    customizationBtn.style.cssText = "right : 0;";
  } else {
    customizationBtn.style.cssText = "right : 20rem;";
  }
}

customizeHomePage();
// LoadSettings
function loadSettings() {
  const savedTheme = localStorage.getItem("theme");
  const htmlElement = document.querySelector("html");
  if (savedTheme) {
    if (savedTheme === "light") {
      htmlElement.classList.remove("dark");
      htmlElement.classList.add("light");
    } else {
      htmlElement.classList.remove("light");
      htmlElement.classList.add("dark");
    }
  }

  const savedFont = localStorage.getItem("selectedFont");
  if (savedFont) {
    const fontsOptions = ["font-alexandria", "font-cairo", "font-tajawal"];
    fontsOptions.forEach((f) => document.body.classList.remove(f));

    document.body.classList.add(`font-${savedFont}`);

    const fontBtns = document.querySelectorAll(".font-option");
    fontBtns.forEach((btn) => {
      btn.classList.remove("active", "border-primary");
      btn.classList.add("border-slate-200", "dark:border-slate-700");
      btn.setAttribute("aria-checked", "false");
      const check = btn.querySelector("div");
      if (check) {
        check.classList.remove("opacity-100");
        check.classList.add("opacity-0");
      }

      if (btn.getAttribute("data-font") === savedFont) {
        btn.classList.add("active", "border-primary");
        btn.classList.remove("border-slate-200", "dark:border-slate-700");
        btn.setAttribute("aria-checked", "true");
        if (check) {
          check.classList.remove("opacity-0");
          check.classList.add("opacity-100");
        }
      }
    });
  }

  const savedColorTheme = localStorage.getItem("selectedTheme");
  if (savedColorTheme) {
    const { primary, secondary } = JSON.parse(savedColorTheme);

    document.documentElement.style.setProperty("--color-primary", primary);
    document.documentElement.style.setProperty("--color-secondary", secondary);

    setTimeout(() => {
      const colorBtns = document.querySelectorAll(".theme-color-btn");
      colorBtns.forEach((btn) => {
        if (btn.getAttribute("data-primary") === primary) {
          document.querySelectorAll(".theme-color-btn").forEach((b) => {
            b.classList.remove("border-primary", "scale-110");
            b.classList.add("border-slate-200", "dark:border-slate-700");
          });

          btn.classList.remove("border-slate-200", "dark:border-slate-700");
          btn.classList.add("border-primary", "scale-110");
        }
      });
    }, 0);
  }
}

// ResetSetting
function resetSetting() {
  const resetSettingBtn = document.querySelector("#reset-settings");

  resetSettingBtn.addEventListener("click", () => {
    localStorage.removeItem("theme");
    localStorage.removeItem("selectedFont");
    localStorage.removeItem("selectedTheme");

    const htmlElement = document.querySelector("html");
    htmlElement.classList.remove("light");
    htmlElement.classList.add("dark");

    const fontsOptions = ["font-alexandria", "font-cairo", "font-tajawal"];
    fontsOptions.forEach((f) => document.body.classList.remove(f));
    document.body.classList.add("font-tajawal");

    const fontBtns = document.querySelectorAll(".font-option");
    fontBtns.forEach((btn) => {
      btn.classList.remove("active", "border-primary");
      btn.classList.add("border-slate-200", "dark:border-slate-700");
      btn.setAttribute("aria-checked", "false");

      const check = btn.querySelector("div");
      if (check) {
        check.classList.remove("opacity-100");
        check.classList.add("opacity-0");
      }

      if (btn.getAttribute("data-font") === "tajawal") {
        btn.classList.add("active", "border-primary");
        btn.classList.remove("border-slate-200", "dark:border-slate-700");
        btn.setAttribute("aria-checked", "true");
        if (check) {
          check.classList.remove("opacity-0");
          check.classList.add("opacity-100");
        }
      }
    });

    const defaultPrimary = "#6366f1";
    const defaultSecondary = "#8b5cf6";

    document.documentElement.style.setProperty(
      "--color-primary",
      defaultPrimary
    );
    document.documentElement.style.setProperty(
      "--color-secondary",
      defaultSecondary
    );

    const colorBtns = document.querySelectorAll(".theme-color-btn");
    colorBtns.forEach((btn) => {
      btn.classList.remove("border-primary", "scale-110");
      btn.classList.add("border-slate-200", "dark:border-slate-700");

      if (btn.getAttribute("data-primary") === defaultPrimary) {
        btn.classList.remove("border-slate-200", "dark:border-slate-700");
        btn.classList.add("border-primary", "scale-110");
      }
    });
    toggleMenuState();
  });
}

// Mobile Menu Button
function initMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");
  const menuIcon = menuBtn.querySelector("i");

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");

    const isExpanded = navLinks.classList.contains("active");
    menuBtn.setAttribute("aria-expanded", isExpanded);

    if (isExpanded) {
      menuIcon.classList.remove("fa-bars");
      menuIcon.classList.add("fa-xmark");
    } else {
      menuIcon.classList.remove("fa-xmark");
      menuIcon.classList.add("fa-bars");
    }
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      menuIcon.classList.remove("fa-xmark");
      menuIcon.classList.add("fa-bars");
    });
  });
}

// Scroll to top button
function initScrollToTop() {
  const scrollBtn = document.querySelector("#scroll-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      scrollBtn.classList.remove("opacity-0", "invisible");
      scrollBtn.classList.add("opacity-100", "visible");
    } else {
      scrollBtn.classList.add("opacity-0", "invisible");
      scrollBtn.classList.remove("opacity-100", "visible");
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

initScrollToTop();

initMobileMenu();

loadSettings();

resetSetting();
