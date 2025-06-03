Hooks.once("init", async function () {
  console.log("Cutscene Text init - Registrering Socket");
  game.socket.on("module.cutscene-text", (data) => {
    displayCutscene(data);
  });

  game.cutsceneText = {
    activateCutscene,
    cutsceneOverlay: CutsceneOverlay,
    currentOverlay: null,
  };

  //Register settings

  const permissionLevels = [
    game.i18n.localize("SETTINGS.CutsceneTextPermission.Player"),
    game.i18n.localize("SETTINGS.CutsceneTextPermission.Trusted"),
    game.i18n.localize("SETTINGS.CutsceneTextPermission.Assistant"),
    game.i18n.localize("SETTINGS.CutsceneTextPermission.GM"),
  ];

  game.settings.register("cutscene-text", "permissions-emit", {
    name: "SETTINGS.CutsceneTextPermission.Title",
    hint: "SETTINGS.CutsceneTextPermission.TitleHint",
    scope: "world",
    config: true,
    default: 3,
    type: Number,
    choices: permissionLevels,
    onChange: debouncedReload,
  });

  game.settings.register("cutscene-text", "colorFont", {
    name: "SETTINGS.CutsceneTextColorFont",
    hint: "SETTINGS.CutsceneTextColorFontHint",
    scope: "world",
    type: String,
    default: "#ffffff",
    config: true,
  });

  game.settings.register("cutscene-text", "colorShadow", {
    name: "SETTINGS.CutsceneTextColorShadow",
    hint: "SETTINGS.CutsceneTextColorShadowHint",
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  game.settings.register("cutscene-text", "subColorFont", {
    name: "SETTINGS.CutsceneTextSubColorFont",
    hint: "SETTINGS.CutsceneTextSubColorFontHint",
    scope: "world",
    type: String,
    default: "#ffffff",
    config: true,
  });

  game.settings.register("cutscene-text", "subColorShadow", {
    name: "SETTINGS.CutsceneTextSubColorShadow",
    hint: "SETTINGS.CutsceneTextSubColorShadowHint",
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  game.settings.register("cutscene-text", "fontFamily", {
    name: "SETTINGS.CutsceneTextFont",
    hint: "SETTINGS.CutsceneTextFontHint",
    scope: "world",
    default: "Arial",
    config: true,
    type: String,
    choices: FontConfig.getAvailableFontChoices(),
  });

  game.settings.register("cutscene-text", "fontSize", {
    name: "SETTINGS.CutsceneTextFontSize",
    hint: "SETTINGS.CutsceneTextFontSizeHint",
    scope: "world",
    default: "100px",
    config: true,
    type: String,
  });

  game.settings.register("cutscene-text", "subFontSize", {
    name: "SETTINGS.CutsceneTextSubFontSize",
    hint: "SETTINGS.CutsceneTextSubFontSizeHint",
    scope: "world",
    default: "30px",
    config: true,
    type: String,
  });

  game.settings.register("cutscene-text", "splashTimer", {
    name: "SETTINGS.CutsceneTextTimer",
    hint: "SETTINGS.CutsceneTextTimerHint",
    scope: "world",
    default: 5,
    config: true,
    type: Number,
  });
  game.settings.register("cutscene-text", "animationDuration", {
    name: "SETTINGS.CutsceneTextAnimationDuration",
    hint: "SETTINGS.CutsceneTextAnimationDurationHint",
    scope: "world",
    default: 3,
    config: true,
    type: Number,
  });

  game.settings.register("cutscene-text", "animationDelay", {
    name: "SETTINGS.CutsceneTextAnimationDelay",
    hint: "SETTINGS.CutsceneTextAnimationDelayHint",
    scope: "world",
    default: 0,
    config: true,
    type: Number,
  });

  game.settings.register("cutscene-text", "lineTwoDelay", {
    name: "SETTINGS.CutsceneTextLineTwoDelay",
    hint: "SETTINGS.CutsceneTextLineTwoDelayHint",
    scope: "world",
    default: 2000,
    config: true,
    type: Number,
  });

  game.settings.register("cutscene-text", "lineThreeDelay", {
    name: "SETTINGS.CutsceneTextLineThreeDelay",
    hint: "SETTINGS.CutsceneTextLineThreeDelayHint",
    scope: "world",
    default: 7000,
    config: true,
    type: Number,
  });
});

Hooks.on("renderSettingsConfig", (app, el, data) => {
  el.find('[name="cutscene-text.colorFont"]')
    .parent()
    .append(
      `<input type="color" value="${game.settings.get(
        "cutscene-text",
        "colorFont"
      )}" data-edit="cutscene-text.colorFont">`
    );

  el.find('[name="cutscene-text.colorShadow"]')
    .parent()
    .append(
      `<input type="color" value="${game.settings.get(
        "cutscene-text",
        "colorShadow"
      )}" data-edit="cutscene-text.colorShadow">`
    );

  el.find('[name="cutscene-text.subColorFont"]')
    .parent()
    .append(
      `<input type="color" value="${game.settings.get(
        "cutscene-text",
        "subColorFont"
      )}" data-edit="cutscene-text.subColorFont">`
    );

  el.find('[name="cutscene-text.subColorShadow"]')
    .parent()
    .append(
      `<input type="color" value="${game.settings.get(
        "cutscene-text",
        "subColorShadow"
      )}" data-edit="cutscene-text.subColorShadow">`
    );

  //Render fonts
  let fontList = FontConfig.getAvailableFontChoices();
  const selectedFont = game.settings.get("cutscene-text", "fontFamily");
  for (const font in fontList) {
    let setSelected = false;
    if (selectedFont == fontList[font]) setSelected = true;
    let o = new Option(fontList[font], font, setSelected, setSelected);
    el.find('[name="cutscene-text.fontFamily"]').append(o);
  }
});

async function activateCutscene(options = {}) {
  //if (!game.user.isGM) {

  if (
    game.user.role <= game.settings.get("cutscene-text", "permissions-emit")
  ) {
    ui.notifications.warn(game.i18n.localize("CutsceneText.ErrorGM"));
    return;
  }
  options.sound = options.sound ?? null;

  await game.socket.emit("module.cutscene-text", options);
  //display for yourself
  displayCutscene(options);
}

function displayCutscene(options = {}) {
  if (options.close) {
    if (game.cutsceneText.currentOverlay) {
      game.cutsceneText.currentOverlay.close({ force: true });
    }
    return;
  }

  if (game.cutsceneText.currentOverlay) {
    if (game.user.isGM) {
      ui.notifications.warn(game.i18n.localize("CutsceneText.ErrorCount"));
    }
    return;
  }

  let overlay = new game.cutsceneText.cutsceneOverlay(options);
  let overlayDelay =
    options.animationDelay ??
    game.settings.get("cutscene-text", "animationDelay");

  const delayOverlayTimer = setTimeout(async function () {
    overlay.render(true);
    game.cutsceneText.currentOverlay = overlay;

    // Timer to remove the overlay
    let timerLength =
      options.timer ?? game.settings.get("cutscene-text", "splashTimer") * 1000;

    if (timerLength > 0) {
      //Close overlay after delay
      setTimeout(async function () {
        await overlay.fadeAndThenClose({ animate: true });
      }, timerLength);
    }
  }, overlayDelay);
}

export class CutsceneOverlay extends Application {
  constructor(...args) {
    if (args[0].video) {
      args[0].template =
        "modules/cutscene-text/templates/cutscene-text-video.hbs";
    }
    super(...args);
  }

  /**
   * Debounce and slightly delayed request to re-render this panel. Necessary for situations where it is not possible
   * to properly wait for promises to resolve before refreshing the UI.
   */
  refresh = foundry.utils.debounce(this.render, 100);

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      ...super.defaultOptions,
      id: "cutscene-text-overlay",
      popOut: false,
      classes: ["cutscenetext"],
      template: "modules/cutscene-text/templates/cutscene-text.hbs",
      colorFont: null,
      subColorFont: null,
      colorShadow: null,
      subColorShadow: null,
      lineOne: null,
      lineTwo: null,
      lineThree: null,
      lineTwoDelay: null,
      lineThreeDelay: null,
      animationDuration: null,
      animationDelay: null,
      fontFamily: null,
      fontSize: null,
      subFontSize: null,
      video: null,
      fill: false,
    });
  }

  async getData(options = {}) {
    const context = super.getData(options);
    context.colorFont =
      this.options.colorFont ?? game.settings.get("cutscene-text", "colorFont");
    context.subColorFont =
      this.options.subColorFont ??
      game.settings.get("cutscene-text", "subColorFont");
    context.colorShadow =
      this.options.colorShadow ??
      game.settings.get("cutscene-text", "colorShadow");
    context.subColorShadow =
      this.options.subColorShadow ??
      game.settings.get("cutscene-text", "subColorShadow");
    context.lineOne = this.options.lineOne;
    context.lineTwo = this.options.lineTwo;
    context.lineThree = this.options.lineThree;
    context.lineTwoDelay =
      this.options.lineTwoDelay ??
      game.settings.get("cutscene-text", "lineTwoDelay");
    context.lineThreeDelay =
      this.options.lineThreeDelay ??
      game.settings.get("cutscene-text", "lineThreeDelay");

    context.animationDuration =
      this.options.animationDuration ??
      game.settings.get("cutscene-text", "animationDuration");
    context.animationDelay =
      this.options.animationDelay ??
      game.settings.get("cutscene-text", "animationDelay");
    context.fontFamily =
      this.options.fontFamily ??
      game.settings.get("cutscene-text", "fontFamily");
    context.fontSize =
      this.options.fontSize ?? game.settings.get("cutscene-text", "fontSize");
    context.subFontSize =
      this.options.subFontSize ??
      game.settings.get("cutscene-text", "subFontSize");
    context.video = this.options.video;
    context.fill = this.options.fill;
    return context;
  }

  async refresh(force) {
    return foundry.utils.debounce(this.render.bind(this, force), 100)();
  }

  async fadeAndThenClose(options) {
    if (this.element) {
      const textLines = this.element[0].querySelectorAll(".fade-in");
      textLines.forEach((line) => {
        line.classList.remove("fade-in");
        line.style.removeProperty("animation-delay");
        line.classList.add("fade-out");
      });
    }

    return new Promise((resolve) => {
      setTimeout(async function () {
        resolve(close(options));
      }, (this.options.animationDuration ??
        game.settings.get("cutscene-text", "animationDuration")) * 1000);
    });
  }

  async close(options) {
    super.close(options);
    game.cutsceneText.currentOverlay = null;
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}
