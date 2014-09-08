var $idc, callbacks, isIE10M, timer;

isIE10M = function() {
  if (window.navigator.msMaxTouchPoints) {
    return true;
  } else {
    return false;
  }
};

if (!$.support.transition) {
  $.fn.transition = $.fn.animate;
}

callbacks = [];

$idc = 0;

timer = [];

$.fn.kNavigator = function() {
  var $blocks, $me, $navigatortype, i;
  $me = $(this);
  $blocks = $me.children(".k-container").children(".k-block");
  $navigatortype = $(this).data("navigatortype");
  i = 1;
  $blocks.each(function() {
    var $icon;
    if ($navigatortype === "number") {
      $icon = i;
    }
    if ($navigatortype === "bullet") {
      $icon = "";
    }
    if ($navigatortype === "html") {
      $icon = $($me.data("navigator")).find(".k-nav-content").html();
    }
    if ($navigatortype === "thumbnail") {
      $icon = "<img src=\"" + $(this).data("thumbnail") + "\" border=\"0\">";
    }
    $($me.data("navigator")).append("<div class=\"k-nav k-nav-" + $navigatortype + "\" data-parent=\"#" + $me.attr("id") + "\" data-block-id=\"" + i + "\"><div class=\"k-" + $navigatortype + "\">" + $icon + "</div></div>");
    i++;
  });
};

$.fn.kTimer = function(clear, start) {
  var $counter, $id;
  if ($(this).data("duration") !== 0) {
    $id = $(this).data("id");
    $counter = 0;
    if (clear) {
      $(this).attr("data-isrunning", "no");
    }
    if (start) {
      $(this).attr("data-isrunning", "yes");
    }
    if (timer[$id] == null) {
      timer[$id] = setInterval(function() {
        var $duration, $isrunning;
        $counter++;
        $isrunning = $(".kay[data-id=" + $id + "]").attr("data-isrunning");
        if ($isrunning === "no" || ($isrunning == null)) {
          $counter = 0;
        }
        $duration = Math.round(parseInt($(".kay[data-id=" + $id + "]").attr("data-duration"), 10) / 1000);
        if ($counter % $duration === 0 && $counter !== 0) {
          $(".kay[data-id=" + $id + "]").kButton("next");
        }
      }, 1000);
    }
  }
};

$.fn.kButton = function(direction) {
  var $blocks, $cew, $currentblock, $difference, $direction, $id, $inview, $last, $mew, $nextBlock, $offset, $pagecount, $prevBlock, opt;
  $direction = direction;
  $currentblock = parseInt($(this).attr("data-block"), 10);
  $id = $(this).data("id");
  opt = callbacks[$id];
  if ($(this).data("liquid") === 1) {
    $cew = $(this).children(".k-container").width();
    $mew = $(this).width();
    $offset = parseInt($(this).attr("data-offset"), 10);
    $pagecount = Math.ceil($cew / $mew) - 1;
    $difference = $mew - ($cew - (Math.floor($cew / $mew) * $mew));
    if ($direction === "next") {
      if ($currentblock === $pagecount) {
        opt.end.call(this);
        if ($(this).data("loop") === 1) {
          $offset = 0;
          $currentblock = 0;
        }
      } else {
        if ($currentblock < $pagecount) {
          $offset = $offset - $mew;
          $currentblock++;
        }
        if ($currentblock === $pagecount) {
          $offset = -($cew - $mew);
          $currentblock = $pagecount;
        }
      }
    }
    if ($direction === "prev") {
      if ($currentblock === 0) {
        opt.start.call(this);
        if ($(this).data("loop") === 1) {
          $offset = -($cew - $mew);
          $currentblock = $pagecount;
        }
      } else {
        if ($currentblock > 0) {
          $offset = $offset + $mew;
          $currentblock--;
        }
        if ($currentblock === 0) {
          $offset = 0;
          $currentblock = 0;
        }
      }
    }
    $(this).attr("data-offset", $offset).attr("data-block", $currentblock);
    $(this).stop().kOffset($offset, true);
    false;
  } else {
    $blocks = $(this).children(".k-container").children(".k-block");
    $inview = $(this).width() / $blocks.eq(0).width();
    $last = $blocks.length - $inview;
    if ($direction === "next") {
      $nextBlock = $currentblock + $inview;
      if ($currentblock === $last) {
        opt.end.call(this);
        if ($(this).data("loop") === 1) {
          $currentblock = 0;
        }
      } else if ($nextBlock > $last) {
        $currentblock = $last;
      } else {
        $currentblock = $nextBlock;
      }
    }
    if ($direction === "prev") {
      $prevBlock = $currentblock - $inview;
      if ($currentblock === 0) {
        opt.start.call(this);
        if ($(this).data("loop") === 1) {
          $currentblock = $last;
        }
      } else if ($prevBlock < 0) {
        $currentblock = 0;
      } else {
        $currentblock = $prevBlock;
      }
    }
    $(this).attr("data-block", $currentblock);
    $(this).kGo(true);
  }
};

$.fn.kGo = function(snap) {
  var $blocks, $currentblock, $me, $width, newoffset;
  $me = $(this);
  $blocks = $me.children(".k-container").children(".k-block");
  $currentblock = parseInt($me.attr("data-block"), 10);
  $width = $me.width();
  newoffset = -($currentblock * $blocks.eq(0).width());
  $me.attr("data-offset", newoffset).attr("data-block", $currentblock);
  $me.stop().kOffset($(this).attr("data-offset"), snap);
};

$.fn.kOffset = function(offset, snap) {
  var $blocks, $container, $currentblock, $me, $offset;
  $offset = parseInt(offset, 10);
  $me = $(this);
  $container = $me.children(".k-container");
  $blocks = $container.children(".k-block");
  $currentblock = parseInt($me.attr("data-block"), 10) + 1;
  if (snap) {
    $container.stop().transition({
      x: $offset
    }, parseInt($me.data("transition"), 10));
    if ($me.data("navigator") !== 0) {
      $($me.data("navigator")).find(".k-nav").removeClass("k-nav-" + $me.data("navigatortype") + "-active");
      $($me.data("navigator")).find(".k-nav[data-block-id=" + $currentblock + "]").addClass("k-nav-" + $me.data("navigatortype") + "-active");
    }
  } else {
    $container.css({
      x: $offset
    });
  }
};

$.fn.kay = function() {
  var $block, $blocks, $container, $content, $dTS, $distance, $duration, $fixed, $full, $height, $id, $isDragging, $isMouseover, $liquid, $loop, $me, $meID, $navigator, $navigatortype, $next, $offset, $prev, $tra, $treshold, $width, opt;
  $me = $(this);
  if ($me.data("id") != null) {
    return false;
  }
  if ($me.find(".kay").length > 0) {
    $me.find(".kay").each(function() {
      $(this).kay();
      $(this).children(".k-container").css({
        opacity: 1
      });
    });
  }
  opt = $.extend({
    loading: "&bull;&bull;&bull;",
    end: function() {},
    start: function() {}
  }, arguments[0] || {});
  $content = $me.html();
  $me.html("<div class=\"k-loading\">" + opt.loading + "</span></div><div class=\"k-container clearfix\">" + $content + "</div>");
  $container = $me.children(".k-container");
  $blocks = $container.children(".k-block");
  $width = void 0;
  $height = void 0;
  $duration = void 0;
  $tra = void 0;
  $full = void 0;
  $navigator = void 0;
  $navigatortype = void 0;
  $next = void 0;
  $prev = void 0;
  $block = void 0;
  $offset = void 0;
  $distance = void 0;
  $treshold = void 0;
  $fixed = void 0;
  if ($me.data("duration") == null) {
    $duration = 0;
    $me.attr("data-duration", 0);
  } else {
    $duration = $me.data("duration");
  }
  if ($me.data("fixed") == null) {
    $fixed = 0;
    $me.attr("data-fixed", 0);
  } else {
    $fixed = $me.data("fixed");
  }
  if ($me.data("transition") == null) {
    $tra = 500;
    $me.attr("data-transition", 500);
  } else {
    $tra = $me.data("transition");
  }
  if ($me.data("full") == null) {
    $full = 0;
    $me.attr("data-full", 0);
  } else {
    $full = $me.data("full");
  }
  if ($me.data("liquid") == null) {
    $liquid = 0;
    $me.attr("data-liquid", 0);
  } else {
    $liquid = $me.data("liquid");
  }
  if ($me.data("treshold") == null) {
    $treshold = 0.2;
    $me.attr("data-treshold", 0.2);
  } else {
    $treshold = $me.data("treshold");
  }
  if ($me.data("loop") == null) {
    $loop = 0;
    $me.attr("data-loop", 0);
  } else {
    $loop = $me.data("loop");
  }
  if ($me.data("navigator") == null) {
    $navigator = 0;
    $me.attr("data-navigator", 0);
  } else {
    $navigator = $me.data("navigator");
  }
  if ($me.data("navigatortype") == null) {
    $navigatortype = "bullet";
    $me.attr("data-navigatortype", "bullet");
  } else {
    $navigatortype = $me.data("navigatortype");
  }
  if ($me.data("next") == null) {
    $next = 0;
    $me.attr("data-next", 0);
  } else {
    $next = $me.data("next");
  }
  if ($me.data("prev") == null) {
    $prev = 0;
    $me.attr("data-prev", 0);
  } else {
    $prev = $me.data("prev");
  }
  $me.attr("data-block", 0).attr("data-offset", 0).attr("data-width", 0).attr("data-height", 0);
  $block = $me.data("block");
  $offset = $me.data("offset");
  $width = $me.data("width");
  $height = $me.data("height");
  $me.attr("data-id", $idc);
  $id = $me.data("id");
  $meID = "#" + $me.attr("id");
  $idc++;
  callbacks[$id] = opt;
  $container.css({
    opacity: 0
  });
  $me.find("a").each(function() {
    $(this).attr("onmousedown", "event.preventDefault ? event.preventDefault() : event.returnValue = false");
  });
  $me.find("img").each(function() {
    $(this).attr("onmousedown", "event.preventDefault ? event.preventDefault() : event.returnValue = false").width($(this).data("width")).height($(this).data("height"));
  });
  if ($next !== 0) {
    $($next).on("release", function() {
      $me.kButton("next");
      $me.kTimer(true, true);
    });
  }
  if ($prev !== 0) {
    $($prev).on("release", function() {
      $me.kButton("prev");
      $me.kTimer(true, true);
    });
  }
  $isMouseover = false;
  $isDragging = false;
  $(document).on("mouseenter", $meID, function(ev) {
    ev.stopPropagation();
    $isMouseover = true;
    if ($isDragging === true || $isMouseover === true) {
      $(this).kTimer(true, false);
    } else if ($isDragging === true && $isMouseover === true) {
      $(this).kTimer(true, false);
    } else {
      $(this).kTimer(false, true);
    }
  }).on("mouseleave", $meID, function(ev) {
    ev.stopPropagation();
    $isMouseover = false;
    if ($isDragging === true || $isMouseover === true) {
      $(this).kTimer(true, false);
    } else if ($isDragging === true && $isMouseover === true) {
      $(this).kTimer(true, false);
    } else {
      $(this).kTimer(false, true);
    }
  });
  $(window).on("resize load", function() {
    $me.attr("data-offset", 0).attr("data-block", 0);
    $me.stop().kOffset(0, true);
  });
  $blocks.each(function() {
    if ($(this).height() > $height) {
      $height = $(this).height();
    }
    $width = $width + $(this).width();
  }).each(function() {
    if ($(this).height() < $height) {
      $(this).css({
        marginTop: ($height - $(this).height()) / 2
      });
    }
  });
  $me.attr("data-height", $height).attr("data-width", $width);
  $me.css({
    height: $height
  });
  $container.css({
    width: $width,
    height: $height
  });
  if ($full === 1) {
    $(window).on("resize load", function() {
      var $kw;
      if ($fixed === 0) {
        $kw = $(window).width();
        $blocks.each(function() {
          $(this).width($kw);
        });
        $container.css({
          width: $kw * $blocks.length
        });
        $me.attr("data-width", $kw * $blocks.length);
        $me.kGo(true);
        $container.find(".k-image").find("img").each(function() {
          var $ioh, $iow, $ratio;
          $iow = parseInt($(this).data("width"), 10);
          $ioh = parseInt($(this).data("height"), 10);
          if ($iow > $kw) {
            $ratio = $ioh * ($kw / $iow);
            $(this).css({
              width: $kw,
              height: $ratio,
              marginLeft: 0
            });
          } else {
            $(this).css({
              width: $iow,
              height: $ioh,
              marginLeft: parseInt(($kw - $iow) / 2, 10)
            });
          }
        });
        $blocks.css({
          marginTop: 0
        });
        $height = 0;
        $blocks.each(function() {
          if ($(this).height() > $height) {
            $height = $(this).height();
          }
        }).each(function() {
          if ($(this).height() < $height) {
            $(this).css({
              marginTop: ($height - $(this).height()) / 2
            });
          }
        });
        $me.attr("data-height", $height);
        $me.css({
          height: $height
        });
      } else {
        if ($me.data("fixed-width") === "full" || $me.data("fixed-height") === "full") {
          if ($me.data("fixed-height") !== "full") {
            $me.css({
              width: $(window).width(),
              height: $me.data("fixed-height")
            });
          } else if ($me.data("fixed-width") !== "full") {
            $me.css({
              width: $me.data("fixed-width"),
              height: $(window).height()
            });
          } else {
            $me.css({
              width: $(window).width(),
              height: $(window).height()
            });
          }
        }
        if ($me.data("fixed-width") === "parent" || $me.data("fixed-height") === "parent") {
          if ($me.data("fixed-height") !== "parent") {
            $me.css({
              width: $me.parent().width(),
              height: $me.data("fixed-height")
            });
            $(window).on("resize", function() {
              return $me.css({
                width: $me.parent().width()
              });
            });
          } else if ($me.data("fixed-width") !== "parent") {
            $me.css({
              width: $me.data("fixed-width"),
              height: $me.parent().height()
            });
            $(window).on("resize", function() {
              return $me.css({
                height: $me.parent().height()
              });
            });
          } else {
            $me.css({
              width: $me.parent().width(),
              height: $me.parent().height()
            });
            $(window).on("resize", function() {
              return $me.css({
                width: $me.parent().width(),
                height: $me.parent().height()
              });
            });
          }
        } else {
          $me.css({
            width: $me.data("fixed-width"),
            height: $me.data("fixed-height")
          });
        }
        $blocks.each(function() {
          $(this).css({
            width: $me.width()
          });
          $width = $width + $(this).width();
          if ($(this).height() < $me.height()) {
            $(this).css({
              marginTop: ($me.height() - $(this).height()) / 2
            });
          }
        });
        $container.css({
          width: $width,
          height: $me.height()
        });
        $container.find(".k-image").find("img").each(function() {
          var $hh, $ioh, $iow, $mh, $mw, $rat, $ww;
          $mw = $me.width();
          $mh = $me.height();
          $iow = parseInt($(this).data("width"), 10);
          $ioh = parseInt($(this).data("height"), 10);
          if ($iow > $mw) {
            $ww = true;
          } else {
            $ww = false;
          }
          if ($ioh > $mh) {
            $hh = true;
          } else {
            $hh = false;
          }
          if ($iow > $mw) {
            $rat = $mw / $iow;
            $(this).css({
              width: $mw,
              height: $ioh * $rat
            });
            if ($(this).height() > $mh) {
              $rat = $mh / $ioh;
              $(this).css({
                height: $mh,
                width: $iow * $rat
              });
            }
          } else if ($ioh < $mh) {
            $(this).css({
              width: $iow,
              height: $ioh
            });
          }
          if ($ioh > $mh) {
            $rat = $mh / $ioh;
            $(this).css({
              height: $mh,
              width: $iow * $rat
            });
            if ($(this).width() > $mw) {
              $rat = $mw / $iow;
              $(this).css({
                width: $mw,
                height: $ioh * $rat
              });
            }
          } else if ($iow < $mw) {
            $(this).css({
              height: $ioh,
              width: $iow
            });
          }
          $(this).parents(".k-block").css({
            marginTop: ($mh - $(this).height()) / 2
          });
        });
      }
    });
  }
  $(document).on("dragstart", $meID, function(ev) {
    ev.stopPropagation();
    if (ev.gesture.direction === "left" || ev.gesture.direction === "right") {
      $isDragging = true;
      if (ev.gesture.pointerType === "touch" || $(this).data("duration") !== 0) {
        $(".kay").each(function() {
          $(this).kTimer(true, false);
        });
      } else {
        $(this).kTimer(true, false);
      }
      document.ontouchmove = function(e) {
        e.preventDefault();
      };
      $distance = 0;
    }
  });
  $(document).on("drag", $meID, function(ev) {
    var $cew, $currentblock, $inview, $last, $mew;
    ev.stopPropagation();
    $currentblock = parseInt($(this).attr("data-block"), 10);
    if ($(this).data("liquid") === 1) {
      $cew = $(this).children(".k-container").width();
      $mew = $(this).width();
      $last = Math.ceil($cew / $mew) - 1;
    } else {
      $blocks = $(this).children(".k-container").children(".k-block");
      $inview = $(this).width() / $blocks.eq(0).width();
      $last = $blocks.length - $inview;
    }
    if (ev.gesture.direction === "left" || ev.gesture.direction === "right") {
      if ($isDragging) {
        $distance = ev.gesture.deltaX;
        if ($currentblock === 0 && ev.gesture.direction === "right") {
          $distance = ev.gesture.deltaX / 3;
        }
        if ($currentblock === $last && ev.gesture.direction === "left") {
          $distance = ev.gesture.deltaX / 3;
        }
        $(this).stop().kOffset(parseInt($(this).attr("data-offset"), 10) + $distance);
      }
    }
  });
  $dTS = 0;
  $(document).on("dragend", $meID, function(ev) {
    ev.stopPropagation();
    $isDragging = false;
    if (ev.gesture.direction === "left" || ev.gesture.direction === "right") {
      if ($isMouseover === false || $(this).data("duration") !== 0) {
        if (ev.gesture.pointerType === "touch") {
          $(".kay").each(function() {
            $(this).kTimer(false, true);
          });
        }
      }
    }
    if (Math.abs($distance / ($me.width() / 2)) > $treshold) {
      if (ev.gesture.direction === "left") {
        $(this).kButton("next");
      }
      if (ev.gesture.direction === "right") {
        $(this).kButton("prev");
      }
    } else {
      $(this).stop().kOffset(parseInt($(this).attr("data-offset"), 10), true);
    }
    $dTS = ev.timeStamp;
    document.ontouchmove = function(e) {
      return true;
    };
  });
  $(document).on("swipedown", $meID, function(event) {
    var $oContainer;
    if (isIE10M()) {
      $oContainer = $(this).offset();
      $("body,html").scrollTop($oContainer.top - 200);
    }
  }).on("swipeup", $meID, function(event) {
    var $oContainer;
    if (isIE10M()) {
      $oContainer = $(this).offset();
      $("body,html").scrollTop($oContainer.top + $(this).height() - 200);
    }
  });
  $blocks.find("a").on("click", function(event) {
    event.preventDefault();
  });
  $blocks.find("a").on("release", function(ev) {
    var $target, $url;
    if ($dTS < (ev.timeStamp - 750)) {
      $target = $(this).attr("target");
      $url = $(this).attr("href");
      if ($target == null) {
        $target = "_self";
      }
      window.open($url, $target);
    }
  });
  $(document).on("mouseleave", $meID, function() {
    if ($isDragging) {
      $(this).kGo(true);
    }
  });
  if ($duration !== 0) {
    $(this).kTimer(false, true);
  }
  if ($navigator !== 0) {
    $(this).kNavigator();
  }
  $(window).on("load", function() {
    $container.parent().find(".k-loading").transition({
      opacity: 0
    }, 300);
    $container.transition({
      opacity: 100
    }, 300);
  });
};

$(document).ready(function() {
  $(document).hammer({
    drag_max_touches: 1,
    drag_min_distance: 20
  });
  $(document).on("touch", ".k-nav", function() {
    var $parent;
    $parent = $($(this).data("parent"));
    $parent.kTimer(true, false);
  }).on("release", ".k-nav", function() {
    var $goTo, $parent;
    $goTo = parseInt($(this).data("block-id"), 10) - 1;
    $parent = $($(this).data("parent"));
    $parent.attr("data-block", $goTo);
    $parent.kGo(true);
    $parent.kTimer(false, true);
  });
});
