Hooks.once("init", async function () {
  console.log("Cutscene Text init - Registrering Socket");
  game.socket.on("module.cutscene-text", (data) => {
    displayBossOverlay(data);
  });

  game.cutsceneText = {
    splashBoss: splashBoss,
    emiteBoss: splashBoss,
    bossOverlay: BossSplashOverlay,
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

  game.settings.register("cutscene-text", "colorFirst", {
    name: "SETTINGS.CutsceneTextColorFirst",
    hint: "SETTINGS.CutsceneTextColorFirstHint",
    scope: "world",
    type: String,
    default: "#ffd502",
    config: true,
  });

  game.settings.register("cutscene-text", "colorFirst", {
    name: "SETTINGS.CutsceneTextColorFirst",
    hint: "SETTINGS.CutsceneTextColorFirstHint",
    scope: "world",
    type: String,
    default: "#ffd502",
    config: true,
  });

  game.settings.register("cutscene-text", "colorSecond", {
    name: "SETTINGS.CutsceneTextColorSecond",
    hint: "SETTINGS.CutsceneTextColorSecondHint",
    scope: "world",
    type: String,
    default: "#ff8400",
    config: true,
  });

  game.settings.register("cutscene-text", "colorThird", {
    name: "SETTINGS.CutsceneTextColorThird",
    hint: "SETTINGS.CutsceneTextColorThirdHint",
    scope: "world",
    type: String,
    default: "#ff1f9c",
    config: true,
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

  game.settings.register("cutscene-text", "bossSound", {
    name: "SETTINGS.CutsceneTextSound",
    hint: "SETTINGS.CutsceneTextSoundHint",
    scope: "world",
    default: null,
    config: true,
    type: String,
    filePicker: "audio",
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

  game.settings.register("cutscene-text", "splashMessage", {
    name: "SETTINGS.CutsceneTextMessage",
    hint: "SETTINGS.CutsceneTextMessageHint",
    scope: "world",
    default: "{{actor.name}}",
    config: true,
    type: String,
  });

  game.settings.register("cutscene-text", "subText", {
    name: "SETTINGS.CutsceneTextSubText",
    hint: "SETTINGS.CutsceneTextSubTextHint",
    scope: "world",
    default: "",
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

  game.settings.register("cutscene-text", "showTokenHUD", {
    name: "SETTINGS.CutsceneTextTokenHUD",
    hint: "SETTINGS.CutsceneTextTokenHUDHint",
    scope: "world",
    default: true,
    config: true,
    type: Boolean,
  });
});

Hooks.on("renderSettingsConfig", (app, el, data) => {
  // Insert color picker input
  el.find('[name="cutscene-text.colorFirst"]')
    .parent()
    .append(
      `<input type="color" value="${game.settings.get(
        "cutscene-text",
        "colorFirst"
      )}" data-edit="cutscene-text.colorFirst">`
    );

  el.find('[name="cutscene-text.colorSecond"]')
    .parent()
    .append(
      `<input type="color" value="${game.settings.get(
        "cutscene-text",
        "colorSecond"
      )}" data-edit="cutscene-text.colorSecond">`
    );

  el.find('[name="cutscene-text.colorThird"]')
    .parent()
    .append(
      `<input type="color" value="${game.settings.get(
        "cutscene-text",
        "colorThird"
      )}" data-edit="cutscene-text.colorThird">`
    );

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

Hooks.on("renderTokenHUD", (app, html, context) => {
  if (
    game.user.role >= game.settings.get("cutscene-text", "permissions-emit") &&
    game.settings.get("cutscene-text", "showTokenHUD")
  ) {
    const token = app?.object?.document;
    const button = $(
      `<div class="control-icon cutscene-text" title="Splash Boss"><i class="fa-solid fa-bullhorn"></i></div>`
    );
    button.on("mouseup", () => {
      game.cutsceneText.splashBoss();
    });
    const column = ".col.left";
    html.find(column).append(button);
  }
});

Hooks.on("getActorDirectoryEntryContext", (html, options) => {
  if (
    game.user.role >= game.settings.get("cutscene-text", "permissions-emit")
  ) {
    options.push({
      name: `Splash Boss`,
      icon: `<i class="fa-solid fa-bullhorn"></i>`,
      element: {},
      callback: (li) => {
        splashBoss({ actor: li.data("documentId") });
      },
    });
  }
});

async function splashBoss(options = {}) {
  //if (!game.user.isGM) {

  if (
    game.user.role <= game.settings.get("cutscene-text", "permissions-emit")
  ) {
    ui.notifications.warn(game.i18n.localize("CutsceneText.ErrorGM"));
    return;
  }

  let validOptions = false;
  options.sound = options.sound ?? null;

  if (options.actor) {
    validOptions = true;
  } else if (options.video) {
    validOptions = true;
  } else if (options.close) {
    validOptions = true;
  } else if (options.message && options.actorImg) {
    validOptions = true;
  } else if (canvas.tokens.controlled.length) {
    options.actor = canvas.tokens.controlled[0]?.document.actorId;
    options.tokenName = canvas.tokens.controlled[0]?.name;
    validOptions = true;
  }

  if (!validOptions && game.user.isGM) {
    ui.notifications.warn(game.i18n.localize("CutsceneText.ErrorToken"));
    return;
  }
  await game.socket.emit("module.cutscene-text", options);
  //display for yourself
  displayBossOverlay(options);
}

function displayBossOverlay(options = {}) {
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

  let overlay = new game.cutsceneText.bossOverlay(options);
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
        await overlay.close({ force: true });
      }, timerLength);
    }
  }, overlayDelay);

  const sound =
    options.sound ?? game.settings.get("cutscene-text", "bossSound");

  if (!!sound) {
    foundry.audio.AudioHelper.play(
      {
        src: sound,
        volume: game.settings.get("core", "globalInterfaceVolume"),
        autoplay: true,
        loop: false,
      },
      true
    );
  }
}

export class BossSplashOverlay extends Application {
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
      classes: ["bossplash"],
      template: "modules/cutscene-text/templates/cutscene-text.hbs",
      actor: null,
      sound: null,
      colorFirst: null,
      colorSecond: null,
      colorThird: null,
      colorFont: null,
      subColorFont: null,
      colorShadow: null,
      subColorShadow: null,
      actorImg: null,
      message: null,
      subText: null,
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
    context.actor = this.options.actor ?? null;
    context.tokenName = this.options.tokenName ?? null;
    context.colorFirst =
      this.options.colorFirst ??
      game.settings.get("cutscene-text", "colorFirst");
    context.colorSecond =
      this.options.colorSecond ??
      game.settings.get("cutscene-text", "colorSecond");
    context.colorThird =
      this.options.colorThird ??
      game.settings.get("cutscene-text", "colorThird");
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
    context.sound =
      this.options.sound ?? game.settings.get("cutscene-text", "bossSound");
    let actor = game.actors.get(context.actor);
    context.message =
      this.options.message ??
      game.settings.get("cutscene-text", "splashMessage");
    context.subText =
      this.options.subText ?? game.settings.get("cutscene-text", "subText");

    if (actor) {
      context.message = context.message.replace("{{name}}", actor.name);
      context.message = context.message.replace("{{actor.name}}", actor.name);
      context.message = context.message.replace(
        "{{token.name}}",
        options.tokenName
      );
      context.actorImg = this.options.actorImg ?? actor.img;
      context.subText = context.subText.replace("{{actor.name}}", actor.name);
      context.subText = context.subText.replace(
        "{{token.name}}",
        options.tokenName
      );
    } else {
      context.actorImg = this.options.actorImg;
    }
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

  get actor() {
    return this.token?.actor ?? game.user?.character ?? null;
  }

  async refresh(force) {
    return foundry.utils.debounce(this.render.bind(this, force), 100)();
  }

  async close(options) {
    super.close(options);
    game.cutsceneText.currentOverlay = null;
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}
