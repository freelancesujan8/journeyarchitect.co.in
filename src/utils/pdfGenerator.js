import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BUSINESS_CONFIG } from '../config/businessConfig';

/**
 * Generate and download professional Journey Architect Booking Confirmation PDF Voucher
 */
export function generateBookingPDF(booking) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [18, 48, 74];    // #12304A
  const secondaryColor = [22, 124, 128]; // #167C80
  const accentColor = [244, 163, 64];   // #F4A340
  const darkText = [23, 33, 43];
  const mutedText = [102, 113, 124];

  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header Background Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Journey Architect', 14, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(244, 163, 64);
  doc.text('Official Booking Confirmation & Travel Voucher', 14, 23);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.text(`${BUSINESS_CONFIG.address} • Phone: ${BUSINESS_CONFIG.phone}`, 14, 30);

  // Status Badge on Right
  doc.setFillColor(30, 142, 62); // Green
  doc.roundedRect(pageWidth - 56, 12, 42, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(booking.booking_status || 'CONFIRMED', pageWidth - 35, 19.5, { align: 'center' });

  // 2. Booking Summary Reference Strip
  let y = 46;
  doc.setFillColor(247, 245, 240); // Warm bg
  doc.roundedRect(14, y, pageWidth - 28, 18, 3, 3, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(`Booking ID: ${booking.booking_id}`, 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedText);
  const bookingDate = booking.created_at ? new Date(booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN');
  doc.text(`Booking Date: ${bookingDate}`, 18, y + 13);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...secondaryColor);
  doc.text(`Payment Status: ${booking.payment_status || 'SUCCESS'}`, pageWidth - 20, y + 7, { align: 'right' });
  doc.setTextColor(...mutedText);
  doc.setFont('helvetica', 'normal');
  doc.text(`Travel Date: ${booking.travel_date || 'Flexible'}`, pageWidth - 20, y + 13, { align: 'right' });

  // 3. Customer & Trip Details Grid
  y = 70;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('Customer Information', 14, y);
  doc.text('Tour Package Details', (pageWidth / 2) + 4, y);

  y += 4;
  // Left Box: Customer
  doc.setDrawColor(228, 223, 211);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, y, (pageWidth / 2) - 18, 34, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkText);
  doc.text('Lead Traveler:', 18, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.customer_name || 'N/A', 48, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('Phone:', 18, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.customer_phone || 'N/A', 48, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('Email:', 18, y + 22);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.customer_email || 'N/A', 48, y + 22);

  doc.setFont('helvetica', 'bold');
  doc.text('Address:', 18, y + 29);
  doc.setFont('helvetica', 'normal');
  doc.text((booking.customer_address || 'Bongaon / West Bengal').substring(0, 32), 48, y + 29);

  // Right Box: Package
  doc.roundedRect((pageWidth / 2) + 4, y, (pageWidth / 2) - 18, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.text('Package:', (pageWidth / 2) + 8, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text((booking.package_name || 'Holiday Tour Package').substring(0, 28), (pageWidth / 2) + 28, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('Destination:', (pageWidth / 2) + 8, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.destination || 'Selected Destination', (pageWidth / 2) + 28, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('Duration:', (pageWidth / 2) + 8, y + 22);
  doc.setFont('helvetica', 'normal');
  doc.text(`${booking.duration_days || 5} Days / ${booking.duration_nights || 4} Nights`, (pageWidth / 2) + 28, y + 22);

  doc.setFont('helvetica', 'bold');
  doc.text('Travelers:', (pageWidth / 2) + 8, y + 29);
  doc.setFont('helvetica', 'normal');
  doc.text(`${booking.adults || 1} Adults${booking.children ? `, ${booking.children} Children` : ''}`, (pageWidth / 2) + 28, y + 29);

  // 4. Financial & Payment Summary Table
  y += 42;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('Payment & Balance Statement', 14, y);

  const paymentItems = [
    ['Total Tour Package Amount', `Rs. ${Number(booking.total_amount || 0).toLocaleString('en-IN')}`],
    ['Booking Amount Paid (Confirmed)', `Rs. ${Number(booking.paid_amount || booking.booking_amount || 0).toLocaleString('en-IN')}`],
    ['Remaining Balance Due (Pay before/during travel)', `Rs. ${Number(booking.remaining_amount || 0).toLocaleString('en-IN')}`]
  ];

  autoTable(doc, {
    startY: y + 4,
    head: [['Description', 'Amount (INR)']],
    body: paymentItems,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkText
    },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 60, halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 8;

  // 5. Inclusions & Guidelines
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('Important Tour Inclusions & Guidelines', 14, y);

  y += 5;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedText);

  const guidelines = [
    '• Hotel accommodations, scheduled vehicle transfers, and sightseeing spots are reserved as per itinerary.',
    '• Please carry valid Government Photo IDs (Aadhaar / Voter ID / Passport) for all travelers during the trip.',
    '• For any itinerary customization or timing assistance, connect with Journey Architect team on WhatsApp / Phone.',
    '• Remaining tour amount can be settled prior to or during the tour as mutually agreed.'
  ];

  guidelines.forEach((line) => {
    doc.text(line, 14, y);
    y += 4.5;
  });

  // 6. Professional Electronic Disclaimer Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(228, 223, 211);
  doc.line(14, footerY - 4, pageWidth - 14, footerY - 4);

  doc.setFontSize(7.5);
  doc.setTextColor(...mutedText);
  doc.text('Thank you for choosing Journey Architect (Bongaon, West Bengal).', pageWidth / 2, footerY, { align: 'center' });
  doc.text('This document is electronically generated and serves as an official booking voucher. No physical signature is required.', pageWidth / 2, footerY + 4, { align: 'center' });

  // Save the generated PDF
  const filename = `PKHM-Booking-${booking.booking_id || 'Voucher'}.pdf`;
  doc.save(filename);
}
