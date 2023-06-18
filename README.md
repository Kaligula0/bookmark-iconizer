# Bookmark Iconizer
*Chrome browser extension for setting icons for bookmarks which came without it*

It is a browser extension for Chrome browser. It can **set** favicon for any bookmark (or bookmarklet) which doesn't have one.

It can't **change** favicon of a bookmark (or bookmarklet) that already has one. It results from how Chrome handles the favicons – if a website provides favicon for specific URL it stores the favicon in it's database. And nothing can change it (correct me if I'm wrong). So if an URL has no favicon set, we can set it. But not change it afterwards.
There's sometimes a trick you can use if you chose your icon wrong – just change URL a little with something meaningless, for example add a hash (#) at the end (with or without text after it) or add a parameter (&somethingmeaningless). Then Chrome will think it's completely another website and look for a favicon again – if it doesn't find (probably won't), add custom favicon again.

It can't change icon of a folder of bookmarks. Chrome doesn't allow for folder icons different than default.

Available at:
https://chrome.google.com/webstore/detail/bookmark-iconizer/hbnmehpggmbpiackncinpnlgkgbgmpjk

Automatically exported from code.google.com/p/bookmark-iconizer
