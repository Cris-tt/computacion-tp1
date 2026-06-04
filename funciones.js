function elegirBandasActivas() {
    let cantidad = floor(random(1, 3)); // 1 o 2

    // Mezcla el arreglo y toma las primeras
    bandasActivas = shuffle([...bandas]).slice(0, cantidad);
}

