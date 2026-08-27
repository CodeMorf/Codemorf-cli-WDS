use base64::{engine::general_purpose::STANDARD, Engine as _};
use std::{fs, path::PathBuf};

fn main() {
    let manifest = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").expect("CARGO_MANIFEST_DIR"));
    let source = manifest.join("icons").join("icon.base64");
    let target = manifest.join("icons").join("icon.ico");

    let encoded = fs::read_to_string(&source).expect("read modern Windows icon source");
    let bytes = STANDARD.decode(encoded.trim()).expect("decode modern Windows icon");
    fs::write(&target, bytes).expect("write modern Windows icon");

    println!("cargo:rerun-if-changed={}", source.display());
    tauri_build::build()
}
