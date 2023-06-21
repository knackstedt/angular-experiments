import { Component } from '@angular/core';
import { HoloCardComponent } from 'src/app/components/holo-card/holo-card.component';
import data from "./cards.json";
import { NgForOf } from '@angular/common';

@Component({
    selector: 'app-holo-cards',
    templateUrl: './holo-cards.component.html',
    styleUrls: ['./holo-cards.component.scss'],
    imports: [
        NgForOf,
        HoloCardComponent
    ],
    standalone: true
})
export class HoloCardsComponent {
    cards = data;

    showcase = {
        // 2202x2202
        number: '132',
        "id": "swsh9-132",
        "set": "swsh9",
        "name": "Boss's Orders",
        "supertype": "pokémon",
        "subtypes": ["basic", 'radiant'],
        types: ['lightning'],
        rarity: "radiant rare",
        images: {
            small: "https://localhost:4400/assets/img.png",
            foil: "https://localhost:4400/assets/foil.webp",
            shine: "https://localhost:4400/assets/foil.webp",
            mask: "https://localhost:4400/assets/mask.webp"
        },
        custom: {
            "--clip": ""
        }
    };
    // showcase = data[0];
    basics = data.slice(1, 4);
    reverse = [...data.slice(4, 7), ...data.slice(70, 76)];
    holos = data.slice(7, 13);
    cosmos = data.slice(13, 16);
    amazings = data.slice(76, 85);
    radiant = data.slice(16, 19);
    basicGallery = data.slice(19, 22);
    vee = data.slice(22, 25);
    veeUltra = data.slice(25, 28);
    veeAlt = data.slice(28, 34);
    veeMax = data.slice(37, 40);
    veeMaxAlt = data.slice(40, 43);
    veeStar = data.slice(43, 46);
    trainerHolo = data.slice(46, 52);
    rainbow = data.slice(52, 58);
    gold = data.slice(58, 64);
    veeGallery = data.slice(64, 70);
    shinyVault = data.slice(85, 91);

    constructor() { }

}
