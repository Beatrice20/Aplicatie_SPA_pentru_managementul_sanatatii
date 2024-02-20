export function calculeazaOreLucrate(programLucru) {
    const [inceput, sfarsit] = programLucru.split(" - ")
    const [oraInceput, minutInceput] = inceput.split(":").map(Number)
    const [oraSfarsit, minutSfarsit] = sfarsit.split(":").map(Number)
  
    const timpInceput =  oraInceput+ minutInceput / 60
    const timpSfarsit = oraSfarsit + minutSfarsit / 60
  
    return timpSfarsit - timpInceput
  }
  