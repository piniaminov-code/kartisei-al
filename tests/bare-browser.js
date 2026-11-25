// Launches Chromium that sees only ONE plain Latin system font (Carlito/Liberation/DejaVu, no emoji
// and no Hebrew), so anything on a card that relies on a device font (emoji, symbols, Hebrew) would
// show up as an empty box. Chromium aborts with zero fonts, hence the single fallback font.
const {chromium}=require('playwright');const fs=require('fs');const os=require('os');const path=require('path');const {execSync}=require('child_process');
function bareEnv(){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'kartisei-fc-'));const fdir=path.join(dir,'fonts');fs.mkdirSync(fdir);
 let font='';for(const fam of ['Carlito','Liberation Sans','DejaVu Sans']){try{font=execSync(`fc-match -f '%{file}' '${fam}'`).toString().trim();if(font&&!/emoji/i.test(font))break;}catch(e){}}
 if(font)fs.symlinkSync(font,path.join(fdir,path.basename(font)));
 fs.writeFileSync(path.join(dir,'fonts.conf'),`<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>${fdir}</dir><cachedir>${path.join(dir,'cache')}</cachedir></fontconfig>`);
 return {...process.env,FONTCONFIG_FILE:path.join(dir,'fonts.conf')};
}
module.exports={launch:(bare,opts)=>chromium.launch(bare?{...(opts||{}),env:bareEnv()}:(opts||{})),bareEnv};
