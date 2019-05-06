function fn() {
    if (n.className == "showout_mobile") {
        n.className = "showin_mobile";
        $("div.tool").hide();
    } else n.className = "showout_mobile"; {
        $("div.tool").hide();
    }
}
$(function() {
    //> 等於child
    //~ 等於兄弟姊妹（siblings）
    //+ 影響的是同一階層（siblings）的標籤

    //div寫在li裡面 收起li時div會被切成li
    //用fadeIn() 文字會有殘影

    //之後再改寫....
    $("li#friend").click(function() {
        $("div.tool").hide();
        if ($("div#friendMenu").css("display") == "none") {
            $("div#friendMenu").show();
        }
    });
    $("li#group").click(function() {
        $("div.tool").hide();
        if ($("div#groupMenu").css("display") == "none") {
            $("div#groupMenu").show();
        }
    });
    // $("li#message").click(function(){  
    // 	$("div.tool").hide();
    // 	if($("div#messageMenu").css("display")=="none"){
    // 		$("div#messageMenu").show();
    // 	}
    // });                             
    $("li#search").click(function() {
        $("div.tool").hide();
        if ($("div#searchMenu").css("display") == "none") {
            $("div#searchMenu").show();
        }
    });
    $("li#setting").click(function() {
        $("div.tool").hide();
        if ($("div#settingMenu").css("display") == "none") {
            $("div#settingMenu").show();
        }
    });
});