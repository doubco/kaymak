
# Kay.js v0.1
# http://doub.co

isIE10M = -> # fix for IE10 mobile
  if window.navigator.msMaxTouchPoints
    true
  else
    false

$.fn.transition = $.fn.animate  unless $.support.transition

callbacks = []
$idc = 0
timer = []

$.fn.kNavigator = ->
  $me = $(this)
  $blocks = $me.children(".k-container").children(".k-block")
  $navigatortype = $(this).data("navigatortype")
  i = 1
  $blocks.each ->
    $icon = i  if $navigatortype is "number"
    $icon = ""  if $navigatortype is "bullet"
    $icon = $($me.data("navigator")).find(".k-nav-content").html()  if $navigatortype is "html"
    $icon = "<img src=\"" + $(this).data("thumbnail") + "\" border=\"0\">"  if $navigatortype is "thumbnail"
    $($me.data("navigator")).append "<div class=\"k-nav k-nav-" + $navigatortype + "\" data-parent=\"#" + $me.attr("id") + "\" data-block-id=\"" + i + "\"><div class=\"k-" + $navigatortype + "\">" + $icon + "</div></div>"
    i++
    return

  return

$.fn.kTimer = (clear, start) ->
  unless $(this).data("duration") is 0
    $id = $(this).data("id")
    $counter = 0
    $(this).attr "data-isrunning", "no"  if clear
    $(this).attr "data-isrunning", "yes"  if start
    unless timer[$id]?
      timer[$id] = setInterval(->
        $counter++
        $isrunning = $(".kay[data-id=" + $id + "]").attr("data-isrunning")
        $counter = 0  if $isrunning is "no" or not $isrunning?
        $duration = Math.round(parseInt($(".kay[data-id=" + $id + "]").attr("data-duration"), 10) / 1000)
        $(".kay[data-id=" + $id + "]").kButton "next"  if $counter % $duration is 0 and $counter isnt 0
        return
      , 1000)
  return

$.fn.kButton = (direction) ->
  $direction = direction
  $currentblock = parseInt($(this).attr("data-block"), 10)
  $id = $(this).data("id")
  opt = callbacks[$id]
  if $(this).data("liquid") is 1
    $cew = $(this).children(".k-container").width()
    $mew = $(this).width()
    $offset = parseInt($(this).attr("data-offset"), 10)
    $pagecount = Math.ceil($cew / $mew) - 1
    $difference = $mew - ($cew - (Math.floor($cew / $mew) * $mew))
    if $direction is "next"
      if $currentblock is $pagecount
        opt.end.call this
        if $(this).data("loop") is 1
          $offset = 0
          $currentblock = 0
      else
        if $currentblock < $pagecount
          $offset = $offset - $mew
          $currentblock++
        if $currentblock is $pagecount
          $offset = -($cew - $mew)
          $currentblock = $pagecount
    if $direction is "prev"
      if $currentblock is 0
        opt.start.call this
        if $(this).data("loop") is 1
          $offset = -($cew - $mew)
          $currentblock = $pagecount
      else
        if $currentblock > 0
          $offset = $offset + $mew
          $currentblock--
        if $currentblock is 0
          $offset = 0
          $currentblock = 0
    $(this).attr("data-offset", $offset).attr "data-block", $currentblock
    $(this).stop().kOffset $offset, true
    false
  else
    $blocks = $(this).children(".k-container").children(".k-block")
    $inview = $(this).width() / $blocks.eq(0).width()
    $last = $blocks.length - $inview
    if $direction is "next"
      $nextBlock = $currentblock + $inview
      if $currentblock is $last
        opt.end.call this
        $currentblock = 0  if $(this).data("loop") is 1
      else if $nextBlock > $last
        $currentblock = $last
      else
        $currentblock = $nextBlock
    if $direction is "prev"
      $prevBlock = $currentblock - $inview
      if $currentblock is 0
        opt.start.call this
        $currentblock = $last  if $(this).data("loop") is 1
      else if $prevBlock < 0
        $currentblock = 0
      else
        $currentblock = $prevBlock
    $(this).attr "data-block", $currentblock
    $(this).kGo true
  return

$.fn.kGo = (snap) ->
  $me = $(this)
  $blocks = $me.children(".k-container").children(".k-block")
  $currentblock = parseInt($me.attr("data-block"), 10)
  $width = $me.width()
  newoffset = -($currentblock * $blocks.eq(0).width())
  $me.attr("data-offset", newoffset).attr "data-block", $currentblock
  $me.stop().kOffset $(this).attr("data-offset"), snap
  return

$.fn.kOffset = (offset, snap) ->
  $offset = parseInt(offset, 10)
  $me = $(this)
  $container = $me.children(".k-container")
  $blocks = $container.children(".k-block")
  $currentblock = parseInt($me.attr("data-block"), 10) + 1
  if snap
    $container.stop().transition
      x: $offset
    , parseInt($me.data("transition"), 10)
    unless $me.data("navigator") is 0
      $($me.data("navigator")).find(".k-nav").removeClass "k-nav-" + $me.data("navigatortype") + "-active"
      $($me.data("navigator")).find(".k-nav[data-block-id=" + $currentblock + "]").addClass "k-nav-" + $me.data("navigatortype") + "-active"
  else
    $container.css x: $offset
  return

$.fn.kay = ->
  $me = $(this)
  return false  if $me.data("id")?
  if $me.find(".kay").length > 0
    $me.find(".kay").each ->
      $(this).kay()
      $(this).children(".k-container").css opacity: 1
      return

  opt = $.extend(
    loading: "&bull;&bull;&bull;"
    end: ->

    start: ->
  , arguments[0] or {})

  $content = $me.html()
  $me.html "<div class=\"k-loading\">"+opt.loading+"</span></div><div class=\"k-container clearfix\">" + $content + "</div>"
  $container = $me.children(".k-container")
  $blocks = $container.children(".k-block")

  $width = undefined
  $height = undefined
  $duration = undefined
  $tra = undefined
  $full = undefined
  $navigator = undefined
  $navigatortype = undefined
  $next = undefined
  $prev = undefined
  $block = undefined
  $offset = undefined
  $distance = undefined
  $treshold = undefined
  $fixed = undefined
  unless $me.data("duration")?
    $duration = 0
    $me.attr "data-duration", 0
  else
    $duration = $me.data("duration")
  unless $me.data("fixed")?
    $fixed = 0
    $me.attr "data-fixed", 0
  else
    $fixed = $me.data("fixed")
  unless $me.data("transition")?
    $tra = 500
    $me.attr "data-transition", 500
  else
    $tra = $me.data("transition")
  unless $me.data("full")?
    $full = 0
    $me.attr "data-full", 0
  else
    $full = $me.data("full")
  unless $me.data("liquid")?
    $liquid = 0
    $me.attr "data-liquid", 0
  else
    $liquid = $me.data("liquid")
  unless $me.data("treshold")?
    $treshold = 0.2
    $me.attr "data-treshold", 0.2
  else
    $treshold = $me.data("treshold")
  unless $me.data("loop")?
    $loop = 0
    $me.attr "data-loop", 0
  else
    $loop = $me.data("loop")
  unless $me.data("navigator")?
    $navigator = 0
    $me.attr "data-navigator", 0
  else
    $navigator = $me.data("navigator")
  unless $me.data("navigatortype")?
    $navigatortype = "bullet"
    $me.attr "data-navigatortype", "bullet"
  else
    $navigatortype = $me.data("navigatortype")
  unless $me.data("next")?
    $next = 0
    $me.attr "data-next", 0
  else
    $next = $me.data("next")
  unless $me.data("prev")?
    $prev = 0
    $me.attr "data-prev", 0
  else
    $prev = $me.data("prev")
  $me.attr("data-block", 0).attr("data-offset", 0).attr("data-width", 0).attr "data-height", 0
  $block = $me.data("block")
  $offset = $me.data("offset")
  $width = $me.data("width")
  $height = $me.data("height")
  $me.attr "data-id", $idc
  $id = $me.data("id")
  $meID = "#" + $me.attr("id")
  $idc++

  callbacks[$id] = opt
  $container.css opacity: 0
  $me.find("a").each ->
    $(this).attr "onmousedown", "event.preventDefault ? event.preventDefault() : event.returnValue = false"
    return

  $me.find("img").each ->
    $(this).attr("onmousedown", "event.preventDefault ? event.preventDefault() : event.returnValue = false").width($(this).data("width")).height $(this).data("height")
    return

  unless $next is 0
    $($next).on "release", ->
      $me.kButton "next"
      $me.kTimer true, true
      return

  unless $prev is 0
    $($prev).on "release", ->
      $me.kButton "prev"
      $me.kTimer true, true
      return

  $isMouseover = false
  $isDragging = false
  $(document).on("mouseenter", $meID, (ev) ->
    ev.stopPropagation()
    $isMouseover = true
    if $isDragging is true or $isMouseover is true
      $(this).kTimer true, false
    else if $isDragging is true and $isMouseover is true
      $(this).kTimer true, false
    else
      $(this).kTimer false, true
    return
  ).on "mouseleave", $meID, (ev) ->
    ev.stopPropagation()
    $isMouseover = false
    if $isDragging is true or $isMouseover is true
      $(this).kTimer true, false
    else if $isDragging is true and $isMouseover is true
      $(this).kTimer true, false
    else
      $(this).kTimer false, true
    return

  $(window).on "resize load", ->
    $me.attr("data-offset", 0).attr "data-block", 0
    $me.stop().kOffset 0, true
    return

  $blocks.each(->
    $height = $(this).height()  if $(this).height() > $height
    $width = $width + $(this).width()
    return
  ).each ->
    $(this).css marginTop: ($height - $(this).height()) / 2  if $(this).height() < $height
    return

  $me.attr("data-height", $height).attr "data-width", $width
  $me.css height: $height
  $container.css
    width: $width
    height: $height

  if $full is 1
    $(window).on "resize load", ->
      if $fixed is 0
        $kw = $(window).width()
        $blocks.each ->
          $(this).width $kw
          return

        $container.css width: $kw * $blocks.length
        $me.attr "data-width", $kw * $blocks.length
        $me.kGo true
        $container.find(".k-image").find("img").each ->
          $iow = parseInt($(this).data("width"), 10)
          $ioh = parseInt($(this).data("height"), 10)
          if $iow > $kw
            $ratio = $ioh * ($kw / $iow)
            $(this).css
              width: $kw
              height: $ratio
              marginLeft: 0

          else
            $(this).css
              width: $iow
              height: $ioh
              marginLeft: parseInt((($kw - $iow) / 2), 10)

          return

        $blocks.css marginTop: 0
        $height = 0
        $blocks.each(->
          $height = $(this).height()  if $(this).height() > $height
          return
        ).each ->
          $(this).css marginTop: ($height - $(this).height()) / 2  if $(this).height() < $height
          return

        $me.attr "data-height", $height
        $me.css height: $height
      else
        if $me.data("fixed-width") is "full" or $me.data("fixed-height") is "full"

          if $me.data("fixed-height") isnt "full"
            $me.css
              width: $(window).width()
              height: $me.data("fixed-height")

          else if $me.data("fixed-width") isnt "full"
            $me.css
              width: $me.data("fixed-width")
              height: $(window).height()

          else
            $me.css
              width: $(window).width()
              height: $(window).height()

        if $me.data("fixed-width") is "parent" or $me.data("fixed-height") is "parent"

          if $me.data("fixed-height") isnt "parent"
            $me.css
              width: $me.parent().width()
              height: $me.data("fixed-height")

            $(window).on "resize", () ->
              $me.css
                width: $me.parent().width()

          else if $me.data("fixed-width") isnt "parent"

            $me.css
              width: $me.data("fixed-width")
              height: $me.parent().height() 
            $(window).on "resize", () ->
              $me.css
                height: $me.parent().height()

          else
            $me.css
              width: $me.parent().width()
              height: $me.parent().height() 
            $(window).on "resize", () ->
              $me.css
                width: $me.parent().width()
                height: $me.parent().height()

        else
          $me.css
            width: $me.data("fixed-width")
            height: $me.data("fixed-height")

        $blocks.each ->
          $(this).css width: $me.width()
          $width = $width + $(this).width()
          $(this).css marginTop: ($me.height() - $(this).height()) / 2  if $(this).height() < $me.height()
          return

        $container.css
          width: $width
          height: $me.height()

        $container.find(".k-image").find("img").each ->
          $mw = $me.width()
          $mh = $me.height()
          $iow = parseInt($(this).data("width"), 10)
          $ioh = parseInt($(this).data("height"), 10)
          if $iow > $mw
            $ww = true
          else
            $ww = false
          if $ioh > $mh
            $hh = true
          else
            $hh = false
          if $iow > $mw
            $rat = $mw / $iow
            $(this).css
              width: $mw
              height: ($ioh * $rat)

            if $(this).height() > $mh
              $rat = $mh / $ioh
              $(this).css
                height: $mh
                width: ($iow * $rat)

          else if $ioh < $mh
            $(this).css
              width: $iow
              height: $ioh

          if $ioh > $mh
            $rat = $mh / $ioh
            $(this).css
              height: $mh
              width: ($iow * $rat)

            if $(this).width() > $mw
              $rat = $mw / $iow
              $(this).css
                width: $mw
                height: ($ioh * $rat)

          else if $iow < $mw
            $(this).css
              height: $ioh
              width: $iow

          $(this).parents(".k-block").css marginTop: ($mh - $(this).height()) / 2
          return

      return

  $(document).on "dragstart", $meID, (ev) ->
    ev.stopPropagation()
    if ev.gesture.direction is "left" or ev.gesture.direction is "right"
      $isDragging = true
      if ev.gesture.pointerType is "touch" or $(this).data("duration") isnt 0
        $(".kay").each ->
          $(this).kTimer true, false
          return

      else
        $(this).kTimer true, false
      document.ontouchmove = (e) ->
        e.preventDefault()
        return

      $distance = 0
    return

  $(document).on "drag", $meID, (ev) ->
    ev.stopPropagation()
    $currentblock = parseInt($(this).attr("data-block"), 10)
    if $(this).data("liquid") is 1
      $cew = $(this).children(".k-container").width()
      $mew = $(this).width()
      $last = Math.ceil($cew / $mew) - 1
    else
      $blocks = $(this).children(".k-container").children(".k-block")
      $inview = $(this).width() / $blocks.eq(0).width()
      $last = $blocks.length - $inview
    if ev.gesture.direction is "left" or ev.gesture.direction is "right"
      if $isDragging
        $distance = ev.gesture.deltaX
        $distance = ev.gesture.deltaX / 3  if $currentblock is 0 and ev.gesture.direction is "right"
        $distance = ev.gesture.deltaX / 3  if $currentblock is $last and ev.gesture.direction is "left"
        $(this).stop().kOffset parseInt($(this).attr("data-offset"), 10) + $distance
    return

  $dTS = 0
  $(document).on "dragend", $meID, (ev) ->
    ev.stopPropagation()
    $isDragging = false
    if ev.gesture.direction is "left" or ev.gesture.direction is "right"
      if $isMouseover is false or $(this).data("duration") isnt 0
        if ev.gesture.pointerType is "touch"
          $(".kay").each ->
            $(this).kTimer false, true
            return

    if Math.abs($distance / ($me.width() / 2)) > $treshold
      $(this).kButton "next"  if ev.gesture.direction is "left"
      $(this).kButton "prev"  if ev.gesture.direction is "right"
    else
      $(this).stop().kOffset parseInt($(this).attr("data-offset"), 10), true
    $dTS = ev.timeStamp
    document.ontouchmove = (e) ->
      true

    return

  $(document).on("swipedown", $meID, (event) ->
    if isIE10M()
      $oContainer = $(this).offset()
      $("body,html").scrollTop $oContainer.top - 200
    return
  ).on "swipeup", $meID, (event) ->
    if isIE10M()
      $oContainer = $(this).offset()
      $("body,html").scrollTop $oContainer.top + $(this).height() - 200
    return

  $blocks.find("a").on "click", (event) ->
    event.preventDefault()
    return

  $blocks.find("a").on "release", (ev) ->
    if $dTS < (ev.timeStamp - 750)
      $target = $(this).attr("target")
      $url = $(this).attr("href")
      $target = "_self"  unless $target?
      window.open $url, $target
    return

  $(document).on "mouseleave", $meID, ->
    $(this).kGo true  if $isDragging
    return

  $(this).kTimer false, true  unless $duration is 0
  $(this).kNavigator()  unless $navigator is 0
  $(window).on "load", ->
    $container.parent().find(".k-loading").transition
      opacity: 0
    , 300
    $container.transition
      opacity: 100
    , 300
    return

  return

$(document).ready ->
  $(document).hammer
    drag_max_touches: 1
    drag_min_distance: 20

  $(document).on("touch", ".k-nav", ->
    $parent = $($(this).data("parent"))
    $parent.kTimer true, false
    return

  ).on "release", ".k-nav", ->
    $goTo = parseInt($(this).data("block-id"), 10) - 1
    $parent = $($(this).data("parent"))
    $parent.attr "data-block", $goTo
    $parent.kGo true
    $parent.kTimer false, true
    return

  return
