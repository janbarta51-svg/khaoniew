"use client";
import { useEffect, useState } from "react";
import { parseMenuPayload, type DayMenu, type Meal, type WeeklyMenu } from "./menu-parser";

const weekMenu: DayMenu[] = [
  { day:"Pondělí", soup:{code:"Polévka",name:"Tom Yam Kai",desc:"s kuřecím masem a houbami",allergens:"4, 12",spicy:true}, meals:[
    {code:"T1",name:"Kai Grob Kari",desc:"křupavá kuřecí prsa, thajské kari, zelenina, bambus, houby, kokosové mléko · příloha rýže",allergens:"1, 4, 6, 11, 12",spicy:true},
    {code:"T2",name:"Pad Phet Pla",desc:"losos, chilli, bambus, cibule, thajská omáčka · příloha jasmínová rýže",allergens:"4, 6, 11, 12, 14",spicy:true},
    {code:"T3",name:"Pad Thai Mu",desc:"restované rýžové nudle s vepřovým masem, zeleninou a arašídy",allergens:"3, 4, 5, 14"},
    {code:"V4",name:"Bún Chả",desc:"vepřové maso, rýžové nudle, zelenina a zálivka",allergens:"4, 6, 11, 12, 14"}
  ], dessert:{code:"Dezert",name:"Palačinky",desc:"s banánem a karamelem",allergens:"1"} },
  { day:"Úterý", soup:{code:"Polévka",name:"Rýžová polévka",desc:"s kuřecím masem a zeleninou",allergens:"4, 6, 12"}, meals:[
    {code:"T1",name:"Mix Sin Jambo",desc:"kuřecí, vepřové a hovězí maso, chilli, citronová tráva, galangal, kešu oříšky, vejce · příloha rýže",allergens:"3, 4, 6, 8, 11, 14",spicy:true},
    {code:"T2",name:"Pad Kai Mad Mukmuang",desc:"restované kuřecí maso, kešu oříšky, houby, zelenina a mix nudle",allergens:"3, 4, 6, 8, 11, 12, 14"},
    {code:"T3",name:"Pad Thai Udon Kai",desc:"restované udon nudle, kuřecí maso, zelenina a sušená cibule",allergens:"1, 3, 4, 6, 12, 14"},
    {code:"V4",name:"Bún Bò Nam Bộ",desc:"hovězí maso, rýžové nudle, zelenina, arašídy, sušená cibule a zálivka",allergens:"4, 5, 6, 11, 14"}
  ], dessert:{code:"Dezert",name:"Ovoce",desc:"s kokosovým mlékem a karamelem",allergens:""} },
  { day:"Středa", soup:{code:"Polévka",name:"Miso",desc:"tradiční lehká polévka",allergens:"4, 6"}, meals:[
    {code:"T1",name:"Mix Sate",desc:"kuřecí a vepřové maso na špízu, arašídová omáčka a mix nudle",allergens:"3, 4, 6, 8, 11"},
    {code:"T2",name:"Kung Kari Lieng Tofu",desc:"krevety, tofu, thajské kari, houby, zelenina, kokosové mléko · příloha rýže",allergens:"2, 4, 6, 12",spicy:true},
    {code:"T3",name:"Pad Thai Kai",desc:"restované rýžové nudle s kuřecím masem, zeleninou a arašídy",allergens:"3, 4, 5, 14"},
    {code:"T4",name:"Yam Sen Sai Tofu",desc:"thajský salát se skleněnými nudlemi, mangem, bylinkami, tofu a arašídy",allergens:"4, 6, 11, 12",veg:true}
  ], dessert:{code:"Dezert",name:"Ovoce",desc:"s kokosovým mlékem a karamelem",allergens:""} },
  { day:"Čtvrtek", soup:{code:"Polévka",name:"Kuřecí polévka",desc:"s vejcem a bambusem",allergens:"3, 4, 6"}, meals:[
    {code:"T1",name:"Ping Pla Mad Mamuang",desc:"grilovaný losos, kešu oříšky, zelenina · příloha jasmínová rýže",allergens:"3, 4, 8, 11, 12, 14"},
    {code:"T2",name:"Keng Masaman Kai",desc:"kuřecí maso, brambory, mrkev, cibule, kokosové mléko, thajské kari a nudle bún",allergens:"4, 6, 11, 12",spicy:true},
    {code:"T3",name:"Pet Phalo Wunsen",desc:"kachní prsa s nudlemi, shiitake houbami, sójovou omáčkou a bylinkami",allergens:"4, 6, 11, 12, 14"},
    {code:"L4",name:"Kaopad Kai Maknat",desc:"restovaná jasmínová rýže s kuřecím masem a ananasem",allergens:"3, 4, 6, 11, 12, 14"}
  ], dessert:{code:"Dezert",name:"Buchta",desc:"",allergens:"1"} },
  { day:"Pátek", soup:{code:"Polévka",name:"Zeleninová polévka",desc:"s vejcem a tofu",allergens:"3, 4, 6"}, meals:[
    {code:"T1",name:"Kai Grob Phong Kari",desc:"křupavá kuřecí prsa, thajské kari, vejce, zelenina, kokosové mléko a rýže",allergens:"1, 3, 4, 6, 11, 12"},
    {code:"T2",name:"Pet Nampeung",desc:"kachní prsa na medu a jasmínová rýže",allergens:"4, 11, 12, 14"},
    {code:"T3",name:"Pad Thai Kai",desc:"restované rýžové nudle s kuřecím masem, zeleninou a arašídy",allergens:"3, 4, 5, 14"},
    {code:"L4",name:"Panyo Sout Kung",desc:"letní závitky s krevetami, mangem, zeleninou, arašídovou omáčkou a mix nudle",allergens:"2, 4, 6, 12"}
  ], dessert:{code:"Dezert",name:"Buchta",desc:"",allergens:"1"} }
];

const FALLBACK_MENU: WeeklyMenu = {
  weekStart: "2026-08-24",
  prices: { set: 189, soup: 25, main: 165, dessert: 20 },
  days: weekMenu
};
const MENU_URL = "https://raw.githubusercontent.com/janbarta51-svg/khaoniew/main/weekly-menu.json";

const standardMenu = [
  {title:"Thajská jídla",items:[
    ["14","Keng Kari Deng Kai","Kuřecí maso, červené kari, bambus, houby, zelenina a kokosové mléko","od 209 Kč"],
    ["15","Nua Kiew Wan","Hovězí maso, zelené kari, bambus, houby, zelenina a kokosové mléko","od 229 Kč"],
    ["23","Pet Kari Deng","Kachní prsa, červené kari, bambus, houby, zelenina a kokosové mléko","od 249 Kč"],
    ["25","Khao Niew Set","Papájový salát, chilli, grilované kuře a lepkavá rýže","od 309 Kč"]
  ]},
  {title:"Nudle a rýže",items:[
    ["10","Phad Thai Mix","Rýžové nudle, kuřecí, vepřové a hovězí maso, zelenina, tofu a arašídy","od 249 Kč"],
    ["11","Phad Thai Kung","Rýžové nudle s krevetami, zeleninou, tofu a arašídy","od 239 Kč"],
    ["12","Phad Thai Tofu","Rýžové nudle se zeleninou a tofu","od 209 Kč"],
    ["28","Khao Phad Kai","Restovaná jasmínová rýže s kuřecím masem a zeleninou","od 209 Kč"]
  ]},
  {title:"Předkrmy a polévky",items:[
    ["","Fried Thai Rolls","Thajské závitky se zeleninou, houbami, nudlemi a sladkokyselou omáčkou","109 Kč"],
    ["","Fresh Rolls Kung","Čerstvé závitky s krevetami, zeleninou, mangem, nudlemi a arašídovou omáčkou","135 Kč"],
    ["6","Tom Yam Kung","Pikantní thajská polévka s krevetami a houbami","119 Kč"],
    ["7","Tom Yam Kai","Pikantní thajská polévka s kuřecím masem a kokosovým mlékem","109 Kč"]
  ]}
];

const gallery = [
  {src:"/images/khao-exterior.jpg",alt:"Venkovní posezení Khaoniew Thai Bistro",label:"Naše bistro"},
  {src:"/images/khao-food-1.jpg",alt:"Khao Niew Set s kuřecím masem a lepivou rýží",label:"Khao Niew Set"},
  {src:"/images/khao-food-2.jpg",alt:"Thajské nudle Phad Thai",label:"Phad Thai"},
  {src:"/images/khao-food-3.jpg",alt:"Tom Yam polévka",label:"Tom Yam"},
  {src:"/images/khao-food-4.jpg",alt:"Restované hovězí maso po thajsku",label:"Nua Prik Thai"},
  {src:"/images/khao-food-5.jpg",alt:"Červené thajské kari s kokosovým mlékem",label:"Keng Kari Deng"}
];

type Lang = "cz" | "en";
const en: Record<string,string> = {
  "Pondělí":"Monday","Úterý":"Tuesday","Středa":"Wednesday","Čtvrtek":"Thursday","Pátek":"Friday","Sobota":"Saturday","Neděle":"Sunday",
  "Polévka":"Soup","Dezert":"Dessert","Palačinky":"Pancakes","Ovoce":"Fruit","Buchta":"Cake",
  "Rýžová polévka":"Rice soup","Kuřecí polévka":"Chicken soup","Zeleninová polévka":"Vegetable soup","tradiční lehká polévka":"traditional light soup",
  "s kuřecím masem a houbami":"with chicken and mushrooms","s banánem a karamelem":"with banana and caramel","s kuřecím masem a zeleninou":"with chicken and vegetables","s kokosovým mlékem a karamelem":"with coconut milk and caramel","s vejcem a bambusem":"with egg and bamboo","s vejcem a tofu":"with egg and tofu",
  "křupavá kuřecí prsa, thajské kari, zelenina, bambus, houby, kokosové mléko · příloha rýže":"crispy chicken breast, Thai curry, vegetables, bamboo, mushrooms and coconut milk · served with rice",
  "losos, chilli, bambus, cibule, thajská omáčka · příloha jasmínová rýže":"salmon, chilli, bamboo, onion and Thai sauce · served with jasmine rice",
  "restované rýžové nudle s vepřovým masem, zeleninou a arašídy":"stir-fried rice noodles with pork, vegetables and peanuts",
  "vepřové maso, rýžové nudle, zelenina a zálivka":"pork, rice noodles, vegetables and dressing",
  "kuřecí, vepřové a hovězí maso, chilli, citronová tráva, galangal, kešu oříšky, vejce · příloha rýže":"chicken, pork and beef, chilli, lemongrass, galangal, cashews and egg · served with rice",
  "restované kuřecí maso, kešu oříšky, houby, zelenina a mix nudle":"stir-fried chicken, cashews, mushrooms, vegetables and mixed noodles",
  "restované udon nudle, kuřecí maso, zelenina a sušená cibule":"stir-fried udon noodles, chicken, vegetables and crispy onion",
  "hovězí maso, rýžové nudle, zelenina, arašídy, sušená cibule a zálivka":"beef, rice noodles, vegetables, peanuts, crispy onion and dressing",
  "kuřecí a vepřové maso na špízu, arašídová omáčka a mix nudle":"chicken and pork skewers, peanut sauce and mixed noodles",
  "krevety, tofu, thajské kari, houby, zelenina, kokosové mléko · příloha rýže":"shrimp, tofu, Thai curry, mushrooms, vegetables and coconut milk · served with rice",
  "restované rýžové nudle s kuřecím masem, zeleninou a arašídy":"stir-fried rice noodles with chicken, vegetables and peanuts",
  "thajský salát se skleněnými nudlemi, mangem, bylinkami, tofu a arašídy":"Thai glass noodle salad with mango, herbs, tofu and peanuts",
  "grilovaný losos, kešu oříšky, zelenina · příloha jasmínová rýže":"grilled salmon, cashews and vegetables · served with jasmine rice",
  "kuřecí maso, brambory, mrkev, cibule, kokosové mléko, thajské kari a nudle bún":"chicken, potatoes, carrot, onion, coconut milk, Thai curry and bún noodles",
  "kachní prsa s nudlemi, shiitake houbami, sójovou omáčkou a bylinkami":"duck breast with noodles, shiitake mushrooms, soy sauce and herbs",
  "restovaná jasmínová rýže s kuřecím masem a ananasem":"stir-fried jasmine rice with chicken and pineapple",
  "křupavá kuřecí prsa, thajské kari, vejce, zelenina, kokosové mléko a rýže":"crispy chicken breast, Thai curry, egg, vegetables, coconut milk and rice",
  "kachní prsa na medu a jasmínová rýže":"honey-glazed duck breast with jasmine rice",
  "letní závitky s krevetami, mangem, zeleninou, arašídovou omáčkou a mix nudle":"fresh rolls with shrimp, mango, vegetables, peanut sauce and mixed noodles",
  "Thajská jídla":"Thai dishes","Nudle a rýže":"Noodles & rice","Předkrmy a polévky":"Starters & soups",
  "Kuřecí maso, červené kari, bambus, houby, zelenina a kokosové mléko":"Chicken, red curry, bamboo, mushrooms, vegetables and coconut milk",
  "Hovězí maso, zelené kari, bambus, houby, zelenina a kokosové mléko":"Beef, green curry, bamboo, mushrooms, vegetables and coconut milk",
  "Kachní prsa, červené kari, bambus, houby, zelenina a kokosové mléko":"Duck breast, red curry, bamboo, mushrooms, vegetables and coconut milk",
  "Papájový salát, chilli, grilované kuře a lepkavá rýže":"Papaya salad, chilli, grilled chicken and sticky rice",
  "Rýžové nudle, kuřecí, vepřové a hovězí maso, zelenina, tofu a arašídy":"Rice noodles, chicken, pork, beef, vegetables, tofu and peanuts",
  "Rýžové nudle s krevetami, zeleninou, tofu a arašídy":"Rice noodles with shrimp, vegetables, tofu and peanuts",
  "Rýžové nudle se zeleninou a tofu":"Rice noodles with vegetables and tofu",
  "Restovaná jasmínová rýže s kuřecím masem a zeleninou":"Stir-fried jasmine rice with chicken and vegetables",
  "Thajské závitky se zeleninou, houbami, nudlemi a sladkokyselou omáčkou":"Thai rolls with vegetables, mushrooms, noodles and sweet-and-sour sauce",
  "Čerstvé závitky s krevetami, zeleninou, mangem, nudlemi a arašídovou omáčkou":"Fresh rolls with shrimp, vegetables, mango, noodles and peanut sauce",
  "Pikantní thajská polévka s krevetami a houbami":"Spicy Thai soup with shrimp and mushrooms",
  "Pikantní thajská polévka s kuřecím masem a kokosovým mlékem":"Spicy Thai soup with chicken and coconut milk",
  "od 209 Kč":"from CZK 209","od 229 Kč":"from CZK 229","od 239 Kč":"from CZK 239","od 249 Kč":"from CZK 249","od 309 Kč":"from CZK 309",
  "Venkovní posezení Khaoniew Thai Bistro":"Outdoor seating at Khaoniew Thai Bistro","Naše bistro":"Our bistro","Khao Niew Set s kuřecím masem a lepivou rýží":"Khao Niew Set with chicken and sticky rice","Thajské nudle Phad Thai":"Thai Phad Thai noodles","Tom Yam polévka":"Tom Yam soup","Restované hovězí maso po thajsku":"Thai-style stir-fried beef","Červené thajské kari s kokosovým mlékem":"Thai red curry with coconut milk",
  "Úvod":"Home","Denní menu":"Lunch menu","Jídelní lístek":"Menu","Fotogalerie":"Gallery","Jak se k nám dostat?":"How to get here","Kontakty":"Contact",
  "Rodinné thajské bistro · Brno":"Family-run Thai bistro · Brno","Thajské jídlo Khaoniew Thai Bistro":"Thai food at Khaoniew Thai Bistro","Thajsko":"Thailand","na talíři.":"on your plate.",
  "Tradiční recepty, čerstvé suroviny a vyvážené chutě. Každé jídlo připravujeme poctivě a na objednávku.":"Traditional recipes, fresh ingredients and balanced flavours. Every dish is freshly prepared to order.",
  "Polední menu":"Lunch menu","Objednat: 775 003 044":"Order: 775 003 044","Domácí kuchyně.":"Home cooking.","Thajské srdce.":"Thai heart.",
  "Malá rodinná restaurace v Černých Polích. Tradiční receptury předávané z generace na generaci, kvalitní suroviny a vůně, které vás přenesou do Thajska.":"A small family restaurant in Černá Pole. Recipes passed down through generations, quality ingredients and aromas that take you straight to Thailand.",
  "Autentické thajské chutě":"Authentic Thai flavours","Čerstvě na objednávku":"Freshly made to order","Polední nabídka · 11:00–15:00":"Lunch offer · 11:00–15:00",
  "Menu set 189 Kč":"Menu set CZK 189","polévka + hlavní jídlo + dezert":"soup + main course + dessert","Výběr poledního menu":"Lunch menu selection",
  "Dnes":"Today","Zítra":"Tomorrow","Tento týden":"This week","pondělí–pátek":"Monday–Friday","hlavní chod":"main course",
  "V neděli máme zavřeno.":"We are closed on Sundays.","O víkendu polední menu nepodáváme.":"Lunch menu is not served at weekends.","Prohlédněte si nabídku na celý pracovní týden.":"See the full weekday menu.","Zobrazit tento týden":"View this week",
  "Čísla u jídel označují alergeny. Pálivá jídla jsou označena symbolem 🌶. Informace byly přepsány z týdenní nabídky restaurace.":"Numbers next to dishes indicate allergens. Spicy dishes are marked with 🌶. Information was transcribed from the restaurant's weekly menu.",
  "Stálá nabídka":"À la carte","Thajské kari, wok, nudle i lehké předkrmy. Přílohu si vyberete podle chuti.":"Thai curries, wok dishes, noodles and light starters. Choose your preferred side.",
  "Celou nabídku najdete také u rozvozových partnerů.":"The full menu is also available from our delivery partners.","Objednat online ↗":"Order online ↗",
  "Ochutnejte očima":"A taste for the eyes","Prohlédněte si naše thajské speciality a příjemné venkovní posezení v Černých Polích.":"Discover our Thai specialities and relaxed outdoor seating in Černá Pole.",
  "„Chuť Thajska,":"“The taste of Thailand,","připravená jako doma.“":"prepared just like home.”","Jsme v Černých Polích, jen pár minut pěšky od zastávky Zemědělská.":"Find us in Černá Pole, just a few minutes' walk from the Zemědělská stop.",
  "Tramvají":"By tram","Linkou 9 na zastávku":"Take tram 9 to","Odtud je bistro přibližně 4 minuty pěšky.":"The bistro is about a 4-minute walk from there.",
  "Pěšky nebo na kole":"On foot or by bike","Vchod i venkovní posezení najdete přímo v ulici Zemědělská. Kolo lze nechat u bistra.":"The entrance and outdoor seating are directly on Zemědělská Street. Bicycles can be left by the bistro.",
  "Autem":"By car","Do navigace zadejte „Khaoniew Thai Bistro“ nebo Zemědělská 1693/38. Parkování hledejte v okolních ulicích.":"Enter “Khaoniew Thai Bistro” or Zemědělská 1693/38 in your navigation. Street parking is available nearby.",
  "Spustit navigaci ↗":"Start navigation ↗","Kde nás najdete":"Where to find us","Naplánovat trasu ↗":"Plan your route ↗","Kontakt":"Contact","Otevírací doba":"Opening hours","Zavřeno":"Closed","Rodinné Thai Bistro v Brně.":"Family-run Thai Bistro in Brno.","Nahoru ↑":"Back to top ↑"
};
function tx(text:string,lang:Lang){return lang==="en"?(en[text]??text):text}

function fmt(d:Date,lang:Lang){return new Intl.DateTimeFormat(lang==="en"?"en-GB":"cs-CZ",{day:"numeric",month:"numeric"}).format(d)}
function parseLocalDate(value:string){const [year,month,day]=value.split("-").map(Number);return new Date(year,month-1,day)}
function addDays(date:Date,days:number){const next=new Date(date);next.setDate(next.getDate()+days);return next}
function daysBetween(a:Date,b:Date){const left=new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime();const right=new Date(b.getFullYear(),b.getMonth(),b.getDate()).getTime();return Math.round((left-right)/86400000)}
function mealName(meal:Meal,lang:Lang){return lang==="en"?(meal.nameEn?.trim()||tx(meal.name,lang)):meal.name}
function mealDescription(meal:Meal,lang:Lang){return lang==="en"?(meal.descEn?.trim()||tx(meal.desc,lang)):meal.desc}

function DayCard({data,date,lang,compact=false}:{data:DayMenu;date?:Date;lang:Lang;compact?:boolean}){
  return <article className={compact?"weekDay compact":"weekDay"}>
    <header><div><span>{lang==="en"?(data.dayEn?.trim()||tx(data.day,lang)):data.day}</span>{date&&<b>{fmt(date,lang)}</b>}</div><strong>11:00–15:00</strong></header>
    <div className="soupLine"><span>{tx(data.soup.code,lang)}</span><h4>{mealName(data.soup,lang)}{data.soup.spicy&&<i>🌶</i>}</h4><p>{mealDescription(data.soup,lang)}</p><small>{data.soup.allergens}</small></div>
    <div className="mealRows">{data.meals.map((m,index)=><div className="mealRow" key={`${m.code}-${index}`}><span>{m.code}</span><div><h4>{mealName(m,lang)}{m.spicy&&<i>🌶</i>}{m.veg&&<em>veg</em>}</h4><p>{mealDescription(m,lang)}</p></div><small>{m.allergens}</small></div>)}</div>
    <div className="dessertLine"><span>{tx(data.dessert.code,lang)}</span><b>{mealName(data.dessert,lang)}</b><p>{mealDescription(data.dessert,lang)}</p><small>{data.dessert.allergens}</small></div>
  </article>
}

export default function Home(){
  const [tab,setTab]=useState<"today"|"tomorrow"|"week">("today");
  const [now,setNow]=useState<Date|null>(null);
  const [lang,setLang]=useState<Lang>("cz");
  const [weeklyMenu,setWeeklyMenu]=useState<WeeklyMenu>(FALLBACK_MENU);
  useEffect(()=>{
    setNow(new Date());
    const saved=window.localStorage.getItem("khaoniew-language");
    if(saved==="cz"||saved==="en") setLang(saved);
    const controller=new AbortController();
    fetch(`${MENU_URL}?t=${Date.now()}`,{cache:"no-store",signal:controller.signal})
      .then(response=>{if(!response.ok) throw new Error("Menu se nepodařilo načíst");return response.json()})
      .then(data=>{const parsed=parseMenuPayload(data);if(parsed) setWeeklyMenu(parsed)})
      .catch(()=>{});
    return ()=>controller.abort();
  },[]);
  useEffect(()=>{document.documentElement.lang=lang==="en"?"en":"cs"},[lang]);
  function chooseLanguage(next:Lang){setLang(next);window.localStorage.setItem("khaoniew-language",next)}
  const t=(text:string)=>tx(text,lang);
  const date=now??new Date("2026-08-24T12:00:00");
  const offset=tab==="tomorrow"?1:0;
  const selectedDate=new Date(date); selectedDate.setDate(date.getDate()+offset);
  const menuMonday=parseLocalDate(weeklyMenu.weekStart);
  const selectedIdx=daysBetween(selectedDate,menuMonday);
  const menuFriday=addDays(menuMonday,4);
  return <main>
    <header className="topbar"><a className="brand khaoBrand" href="#uvod"><img src="/images/khao-logo.png" alt="Khaoniew Thai Bistro"/><span>KHAONIEW</span></a><div className="topControls"><nav><a href="#uvod">{t("Úvod")}</a><a href="#denni-menu">{t("Denní menu")}</a><a href="#jidelni-listek">{t("Jídelní lístek")}</a><a href="#fotogalerie">{t("Fotogalerie")}</a><a href="#doprava">{t("Jak se k nám dostat?")}</a><a href="#kontakt">{t("Kontakty")}</a></nav><div className="langSwitch" role="group" aria-label="Language / Jazyk"><button className={lang==="cz"?"active":""} onClick={()=>chooseLanguage("cz")} aria-pressed={lang==="cz"}>CZ</button><span>/</span><button className={lang==="en"?"active":""} onClick={()=>chooseLanguage("en")} aria-pressed={lang==="en"}>EN</button></div></div></header>
    <section id="uvod" className="hero khaoHero"><img src="/images/khao-hero.png" alt={t("Thajské jídlo Khaoniew Thai Bistro")}/><div className="heroShade"/><div className="heroContent"><p className="eyebrow">{t("Rodinné thajské bistro · Brno")}</p><h1>{t("Thajsko")}<br/><em>{t("na talíři.")}</em></h1><p className="lead">{t("Tradiční recepty, čerstvé suroviny a vyvážené chutě. Každé jídlo připravujeme poctivě a na objednávku.")}</p><div className="actions"><a className="button primary" href="#denni-menu">{t("Polední menu")}</a><a className="button ghost" href="tel:+420775003044">{t("Objednat: 775 003 044")}</a></div></div><div className="heroNote"><b>{t("Polední menu")}</b><span>11:00–15:00</span></div></section>
    <section className="intro wrap"><p className="sectionNo">01</p><div><p className="eyebrow dark">Khaoniew Thai Bistro</p><h2>{t("Domácí kuchyně.")}<br/>{t("Thajské srdce.")}</h2></div><p className="introText">{t("Malá rodinná restaurace v Černých Polích. Tradiční receptury předávané z generace na generaci, kvalitní suroviny a vůně, které vás přenesou do Thajska.")}</p></section>
    <section className="photoStrip"><figure><img src="/images/khao-food-1.jpg" alt="Khao Niew Set"/><figcaption>{t("Autentické thajské chutě")}</figcaption></figure><figure><img src="/images/khao-food-2.jpg" alt="Phad Thai – Khaoniew Thai Bistro"/><figcaption>{t("Čerstvě na objednávku")}</figcaption></figure></section>
    <section id="denni-menu" className="lunch sectionPad"><div className="wrap"><p className="eyebrow dark">{t("Polední nabídka · 11:00–15:00")}</p><div className="titleRow lunchTitle"><h2>{t("Denní menu")}</h2><div className="priceLegend"><b>{lang==="en"?`Menu set CZK ${weeklyMenu.prices.set}`:`Menu set ${weeklyMenu.prices.set} Kč`}</b><span>{t("polévka + hlavní jídlo + dezert")}</span></div></div>
      <div className="menuTabs" role="tablist" aria-label={t("Výběr poledního menu")}><button className={tab==="today"?"active":""} onClick={()=>setTab("today")}>{t("Dnes")}<small>{fmt(date,lang)}</small></button><button className={tab==="tomorrow"?"active":""} onClick={()=>setTab("tomorrow")}>{t("Zítra")}<small>{(()=>{const d=new Date(date);d.setDate(d.getDate()+1);return fmt(d,lang)})()}</small></button><button className={tab==="week"?"active":""} onClick={()=>setTab("week")}>{t("Tento týden")}<small>{fmt(menuMonday,lang)}–{fmt(menuFriday,lang)}</small></button></div>
      <div className="lunchPrices"><span><b>{lang==="en"?`CZK ${weeklyMenu.prices.soup}`:`${weeklyMenu.prices.soup} Kč`}</b> {t("Polévka").toLowerCase()}</span><span><b>{lang==="en"?`CZK ${weeklyMenu.prices.main}`:`${weeklyMenu.prices.main} Kč`}</b> {t("hlavní chod")}</span><span><b>{lang==="en"?`CZK ${weeklyMenu.prices.dessert}`:`${weeklyMenu.prices.dessert} Kč`}</b> {t("Dezert").toLowerCase()}</span></div>
      {tab!=="week"&&(selectedIdx>=0&&selectedIdx<weeklyMenu.days.length?<DayCard data={weeklyMenu.days[selectedIdx]} date={selectedDate} lang={lang}/>:<div className="closedMenu"><b>{t(selectedDate.getDay()===0?"V neděli máme zavřeno.":"O víkendu polední menu nepodáváme.")}</b><p>{t("Prohlédněte si nabídku na celý pracovní týden.")}</p><button onClick={()=>setTab("week")}>{t("Zobrazit tento týden")}</button></div>)}
      {tab==="week"&&<div className="weekList">{weeklyMenu.days.map((d,i)=><DayCard key={`${d.day}-${i}`} data={d} date={addDays(menuMonday,i)} lang={lang} compact/>)}</div>}
      <p className="allergyNote">{t("Čísla u jídel označují alergeny. Pálivá jídla jsou označena symbolem 🌶. Informace byly přepsány z týdenní nabídky restaurace.")}</p>
    </div></section>
    <section id="jidelni-listek" className="foodMenu sectionPad"><div className="wrap"><p className="eyebrow dark">{t("Stálá nabídka")}</p><div className="titleRow"><h2>{t("Jídelní lístek")}</h2><p>{t("Thajské kari, wok, nudle i lehké předkrmy. Přílohu si vyberete podle chuti.")}</p></div><div className="menuGrid three">{standardMenu.map(g=><article className="menuGroup" key={g.title}><h3>{t(g.title)}</h3>{g.items.map(([code,name,desc,price])=><div className="foodItem" key={name}><div><h4>{code&&<span>{code}.</span>} {name}</h4><p>{t(desc)}</p></div><b>{t(price)}</b></div>)}</article>)}</div><div className="orderRow"><p>{t("Celou nabídku najdete také u rozvozových partnerů.")}</p><a href="https://www.foodora.cz/restaurant/htvl/khaoniew-thai-bistro" target="_blank" rel="noreferrer">{t("Objednat online ↗")}</a></div></div></section>
    <section id="fotogalerie" className="gallerySection sectionPad"><div className="wrap"><p className="eyebrow">{t("Ochutnejte očima")}</p><div className="titleRow"><h2>{t("Fotogalerie")}</h2><p>{t("Prohlédněte si naše thajské speciality a příjemné venkovní posezení v Černých Polích.")}</p></div><div className="galleryGrid">{gallery.map((photo,i)=><a className={"galleryItem item"+(i+1)} href={photo.src} target="_blank" rel="noreferrer" key={photo.src}><img src={photo.src} alt={t(photo.alt)}/><span><b>{String(i+1).padStart(2,"0")}</b>{t(photo.label)}</span></a>)}</div></div></section>
    <section className="quoteBlock"><p>{t("„Chuť Thajska,")}<br/>{t("připravená jako doma.“")}</p><span>Khaoniew Thai Bistro · Černá Pole</span></section>
    <section id="doprava" className="directions sectionPad"><div className="wrap"><p className="eyebrow dark">Zemědělská 1693/38 · Brno</p><div className="titleRow"><h2>{t("Jak se k nám dostat?")}</h2><p>{t("Jsme v Černých Polích, jen pár minut pěšky od zastávky Zemědělská.")}</p></div><div className="directionsGrid"><div className="mapWrap"><iframe title="Khaoniew Thai Bistro map" src="https://www.google.com/maps?q=49.2107435,16.6198317&z=16&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div><div className="travelCards"><article><span>01</span><div><h3>{t("Tramvají")}</h3><p>{t("Linkou 9 na zastávku")} <b>Zemědělská</b>. {t("Odtud je bistro přibližně 4 minuty pěšky.")}</p></div></article><article><span>02</span><div><h3>{t("Pěšky nebo na kole")}</h3><p>{t("Vchod i venkovní posezení najdete přímo v ulici Zemědělská. Kolo lze nechat u bistra.")}</p></div></article><article><span>03</span><div><h3>{t("Autem")}</h3><p>{t("Do navigace zadejte „Khaoniew Thai Bistro“ nebo Zemědělská 1693/38. Parkování hledejte v okolních ulicích.")}</p></div></article><a className="routeButton" href="https://www.google.com/maps/dir/?api=1&destination=49.2107435%2C16.6198317" target="_blank" rel="noreferrer">{t("Spustit navigaci ↗")}</a></div></div></div></section>
    <section id="kontakt" className="contact sectionPad"><div className="wrap contactGrid"><div><p className="eyebrow">{t("Kde nás najdete")}</p><h2>Zemědělská 38.<br/>Brno.</h2><a className="bigLink" href="https://www.google.com/maps/dir/?api=1&destination=Zemědělská+1693%2F38%2C+Brno" target="_blank" rel="noreferrer">{t("Naplánovat trasu ↗")}</a></div><div className="contactCard"><h3>{t("Kontakt")}</h3><p>Zemědělská 1693/38<br/>613 00 Brno – Černá Pole</p><p><a href="tel:+420775003044">+420 775 003 044</a><br/><a href="mailto:nammavongpoui@gmail.com">nammavongpoui@gmail.com</a></p><a href="https://www.facebook.com/profile.php?id=61555991112517" target="_blank" rel="noreferrer">Facebook ↗</a></div><div className="hours"><h3>{t("Otevírací doba")}</h3>{["Pondělí","Úterý","Středa","Čtvrtek","Pátek","Sobota"].map(d=><div key={d}><span>{t(d)}</span><b>11:00–20:00</b></div>)}<div><span>{t("Neděle")}</span><b>{t("Zavřeno")}</b></div></div></div></section>
    <footer><a className="brand khaoBrand" href="#uvod"><img src="/images/khao-logo.png" alt=""/><span>KHAONIEW</span></a><p>{t("Rodinné Thai Bistro v Brně.")}</p><a href="#uvod">{t("Nahoru ↑")}</a></footer>
  </main>
}
