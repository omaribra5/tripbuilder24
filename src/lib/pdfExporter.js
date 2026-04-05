import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export function exportTripPDF(trip) {
  const doc = new jsPDF();
  let y = 20;

  const addText = (text, size = 12, bold = false, color = [0, 0, 0]) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(String(text), 170);
    lines.forEach((line) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(line, 20, y);
      y += size * 0.5;
    });
    y += 2;
  };

  // Title
  addText(`Itinerario: ${trip.destination}`, 22, true, [59, 130, 246]);
  if (trip.country) addText(trip.country, 14, false, [100, 100, 100]);
  if (trip.start_date && trip.end_date) {
    addText(
      `${format(new Date(trip.start_date), 'd MMMM yyyy', { locale: it })} → ${format(new Date(trip.end_date), 'd MMMM yyyy', { locale: it })}`,
      11, false, [120, 120, 120]
    );
  }
  y += 6;

  // Itinerary
  (trip.itinerary || []).forEach((day) => {
    if (y > 250) { doc.addPage(); y = 20; }
    addText(`Giorno ${day.day} — ${day.title}`, 15, true, [59, 130, 246]);

    (day.activities || []).forEach((act) => {
      addText(`${act.time}  ${act.name}`, 12, true);
      if (act.description) addText(act.description, 10, false, [80, 80, 80]);
      if (act.tip) addText(`💡 ${act.tip}`, 9, false, [120, 120, 120]);
      y += 2;
    });
    y += 4;
  });

  // Hotels
  if (trip.hotel_suggestions?.length) {
    if (y > 240) { doc.addPage(); y = 20; }
    addText('Hotel consigliati', 16, true, [59, 130, 246]);
    trip.hotel_suggestions.forEach((h) => {
      addText(`${h.name} — ${h.zone}`, 12, true);
      if (h.price_range) addText(`Prezzo: ${h.price_range}`, 10);
      if (h.why) addText(h.why, 10, false, [80, 80, 80]);
      y += 2;
    });
  }

  // Airport transfer
  if (trip.airport_transfer?.options?.length) {
    if (y > 240) { doc.addPage(); y = 20; }
    addText('Trasferimento Aeroporto → Alloggio', 16, true, [59, 130, 246]);
    trip.airport_transfer.options.forEach((opt) => {
      addText(`${opt.type} — ${opt.duration} — ${opt.cost}`, 12, true);
      (opt.steps || []).forEach((step) => addText(`• ${step}`, 10, false, [80, 80, 80]));
      y += 2;
    });
  }

  doc.save(`itinerario-${trip.destination.toLowerCase().replace(/ /g, '-')}.pdf`);
}