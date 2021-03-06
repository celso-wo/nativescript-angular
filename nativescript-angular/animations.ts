import { NgModule, Injectable, NgZone, Provider, RendererFactory2 } from "@angular/core";

import {
    AnimationDriver,
    ɵAnimationEngine as AnimationEngine,
    ɵAnimationStyleNormalizer as AnimationStyleNormalizer,
    ɵWebAnimationsStyleNormalizer as WebAnimationsStyleNormalizer
} from "@angular/animations/browser";

import { ɵAnimationRendererFactory as AnimationRendererFactory } from "@angular/platform-browser/animations";

import { NativeScriptAnimationEngine } from "./animations/animation-engine";
import { NativeScriptAnimationDriver } from "./animations/animation-driver";
import { NativeScriptModule } from "./nativescript.module";
import { NativeScriptRendererFactory } from "./renderer";

@Injectable()
export class InjectableAnimationEngine extends NativeScriptAnimationEngine {
    constructor(driver: AnimationDriver, normalizer: AnimationStyleNormalizer) {
        super(driver, normalizer);
    }
}

export function instantiateSupportedAnimationDriver() {
    return new NativeScriptAnimationDriver();
}

export function instantiateRendererFactory(
        renderer: NativeScriptRendererFactory, engine: AnimationEngine, zone: NgZone) {
    return new AnimationRendererFactory(renderer, engine, zone);
}

export function instanciateDefaultStyleNormalizer() {
    return new WebAnimationsStyleNormalizer();
}

export const NATIVESCRIPT_ANIMATIONS_PROVIDERS: Provider[] = [
    {provide: AnimationDriver, useFactory: instantiateSupportedAnimationDriver},
    {provide: AnimationStyleNormalizer, useFactory: instanciateDefaultStyleNormalizer},
    {provide: AnimationEngine, useClass: InjectableAnimationEngine}, {
        provide: RendererFactory2,
        useFactory: instantiateRendererFactory,
        deps: [NativeScriptRendererFactory, AnimationEngine, NgZone]
    }
];

@NgModule({
    imports: [NativeScriptModule],
    providers: NATIVESCRIPT_ANIMATIONS_PROVIDERS,
})
export class NativeScriptAnimationsModule {
}
