/***********************************************************
 * In questo file è presente la funzione che apre un popup *
 * in cui è richiesto di inserire la password del manager  *
 *                                                         *
 * questa funzione viene richiamata in gestisciPiatti,     *
 * aggiungiPiatto e gestisciTavoli                         *
 ***********************************************************/

function VerificaPwd() {
    let managerpwd = prompt("Inserisci password manager", "admin");
    return managerpwd;
  }