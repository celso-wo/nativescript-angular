import { View } from "tns-core-modules/ui/core/view";

export type ViewResolver = () => ViewClass;
export type NgView = View & ViewExtensions;
export interface ViewClassMeta {
    skipAddToDom?: boolean;
    insertChild?: (parent: NgView, child: NgView, atIndex: number) => void;
    removeChild?: (parent: NgView, child: NgView) => void;
}

export interface ViewExtensions {
    nodeType: number;
    nodeName: string;
    templateParent: NgView;
    ngCssClasses: Map<string, boolean>;
    meta: ViewClassMeta;
}

export interface ViewClass {
    new (): View;
}

const defaultViewMeta: ViewClassMeta = {
    skipAddToDom: false,
};

const elementMap = new Map<string, { resolver: ViewResolver, meta?: ViewClassMeta }>();
const camelCaseSplit = /([a-z0-9])([A-Z])/g;

export function registerElement(
    elementName: string,
    resolver: ViewResolver,
    meta?: ViewClassMeta
): void {
    if (elementMap.has(elementName)) {
        throw new Error(`Element for ${elementName} already registered.`);
    } else {
        const entry = { resolver: resolver, meta: meta };
        elementMap.set(elementName, entry);
        elementMap.set(elementName.toLowerCase(), entry);
        elementMap.set(elementName.replace(camelCaseSplit, "$1-$2").toLowerCase(), entry);
    }
}

export function getViewClass(elementName: string): ViewClass {
    const entry = elementMap.get(elementName) ||
        elementMap.get(elementName.toLowerCase());
    if (!entry) {
        throw new TypeError(`No known component for element ${elementName}.`);
    }
    try {
        return entry.resolver();
    } catch (e) {
        throw new TypeError(`Could not load view for: ${elementName}.${e}`);
    }
}

export function getViewMeta(nodeName: string): ViewClassMeta {
    let meta = defaultViewMeta;
    const entry = elementMap.get(nodeName) || elementMap.get(nodeName.toLowerCase());
    if (entry && entry.meta) {
        meta = entry.meta;
    }
    return meta;
}

export function isKnownView(elementName: string): boolean {
    return elementMap.has(elementName) ||
        elementMap.has(elementName.toLowerCase());
}

// Register default NativeScript components
// Note: ActionBar related components are registerd together with action-bar directives.
registerElement("AbsoluteLayout", () => require("tns-core-modules/ui/layouts/absolute-layout").AbsoluteLayout);
registerElement("ActivityIndicator", () => require("tns-core-modules/ui/activity-indicator").ActivityIndicator);
registerElement("Border", () => require("tns-core-modules/ui/border").Border);
registerElement("Button", () => require("tns-core-modules/ui/button").Button);
registerElement("ContentView", () => require("tns-core-modules/ui/content-view").ContentView);
registerElement("DatePicker", () => require("tns-core-modules/ui/date-picker").DatePicker);
registerElement("DockLayout", () => require("tns-core-modules/ui/layouts/dock-layout").DockLayout);
registerElement("GridLayout", () => require("tns-core-modules/ui/layouts/grid-layout").GridLayout);
registerElement("HtmlView", () => require("tns-core-modules/ui/html-view").HtmlView);
registerElement("Image", () => require("tns-core-modules/ui/image").Image);
// Parse5 changes <Image> tags to <img>. WTF!
registerElement("img", () => require("tns-core-modules/ui/image").Image);
registerElement("Label", () => require("tns-core-modules/ui/label").Label);
registerElement("ListPicker", () => require("tns-core-modules/ui/list-picker").ListPicker);
registerElement("ListView", () => require("tns-core-modules/ui/list-view").ListView);
registerElement("Page", () => require("tns-core-modules/ui/page").Page);
registerElement("Placeholder", () => require("tns-core-modules/ui/placeholder").Placeholder);
registerElement("Progress", () => require("tns-core-modules/ui/progress").Progress);
registerElement("ProxyViewContainer", () => require("tns-core-modules/ui/proxy-view-container").ProxyViewContainer);
registerElement("Repeater", () => require("tns-core-modules/ui/repeater").Repeater);
registerElement("ScrollView", () => require("tns-core-modules/ui/scroll-view").ScrollView);
registerElement("SearchBar", () => require("tns-core-modules/ui/search-bar").SearchBar);
registerElement("SegmentedBar", () => require("tns-core-modules/ui/segmented-bar").SegmentedBar);
registerElement("SegmentedBarItem", () => require("tns-core-modules/ui/segmented-bar").SegmentedBarItem);
registerElement("Slider", () => require("tns-core-modules/ui/slider").Slider);
registerElement("StackLayout", () => require("tns-core-modules/ui/layouts/stack-layout").StackLayout);
registerElement("FlexboxLayout", () => require("tns-core-modules/ui/layouts/flexbox-layout").FlexboxLayout);
registerElement("Switch", () => require("tns-core-modules/ui/switch").Switch);
registerElement("TabView", () => require("tns-core-modules/ui/tab-view").TabView);
registerElement("TextField", () => require("tns-core-modules/ui/text-field").TextField);
registerElement("TextView", () => require("tns-core-modules/ui/text-view").TextView);
registerElement("TimePicker", () => require("tns-core-modules/ui/time-picker").TimePicker);
registerElement("WebView", () => require("tns-core-modules/ui/web-view").WebView);
registerElement("WrapLayout", () => require("tns-core-modules/ui/layouts/wrap-layout").WrapLayout);
registerElement("FormattedString", () => require("tns-core-modules/text/formatted-string").FormattedString);
registerElement("Span", () => require("tns-core-modules/text/span").Span);

registerElement("DetachedContainer", () => require("tns-core-modules/ui/proxy-view-container").ProxyViewContainer,
    { skipAddToDom: true });

registerElement("DetachedText", () => require("ui/placeholder").Placeholder,
    { skipAddToDom: true });

registerElement("Comment", () => require("ui/placeholder").Placeholder,
    { skipAddToDom: false });

