import React from "react";
import Image from "next/image";
import { InvoiceLayout } from "@/app/components";
import { formatNumberWithCommas, isDataUrl, toWords } from "@/lib/helpers";
import { DATE_OPTIONS } from "@/lib/variables";
import { InvoiceType } from "@/types";
import { TRANSCOMIS_HEADER_LOGO_BASE64, INVOICE_STATIC_BACKGROUND_BASE64 } from '@/lib/image-constants';

const InvoiceTemplate3 = (data: InvoiceType & { isPdf?: boolean; details: InvoiceType["details"] & { invoiceBackground?: string } }) => {
  const { sender, receiver, details, isPdf } = data;
  // Forcer la devise à Francs CFA
  const currency = "F CFA";
  // Calcul du total TTC à partir des items et des champs de détails
  const itemsTotal = details.items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  let totalValid = itemsTotal;
  if (details.discountDetails?.amount && details.discountDetails.amountType === "amount") {
    totalValid -= Number(details.discountDetails.amount) || 0;
  }
  if (details.taxDetails?.amount && details.taxDetails.amountType === "amount") {
    totalValid += Number(details.taxDetails.amount) || 0;
  }
  if (details.shippingDetails?.cost && details.shippingDetails.costType === "amount") {
    totalValid += Number(details.shippingDetails.cost) || 0;
  }
  if (isNaN(totalValid)) totalValid = 0;
  // Utiliser le helper toWords pour la conversion en lettres
  const totalInWords = toWords(totalValid, "fr");

  return (
    <InvoiceLayout data={data}>
      <div
        style={{
          position: "relative",
          minHeight: 1122, // A4 height px @ 96dpi (valeur standard pour A4 portrait)
          backgroundColor: '#fff',
          overflow: 'hidden',
          // Utilise le fond statique en base64 si isPdf et image statique
          ...(isPdf && INVOICE_STATIC_BACKGROUND_BASE64
            ? { backgroundImage: `url('${INVOICE_STATIC_BACKGROUND_BASE64}')`, backgroundRepeat: 'no-repeat', backgroundSize: '210mm 297mm', backgroundPosition: 'top center' }
            : details.invoiceBackground && details.invoiceBackground.startsWith('data:image')
              ? { backgroundImage: `url('${details.invoiceBackground}')`, backgroundRepeat: 'no-repeat', backgroundSize: '210mm 297mm', backgroundPosition: 'top center' }
              : {}),
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* === Custom Header TRANSCOMIS INTERNATIONAL === */}
          <div style={{ marginBottom: 24,  padding: '12px 0', textTransform: 'uppercase', fontWeight: 700 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 4 }}>
              <div>
                {/* Logo statique en base64 si isPdf, sinon image classique */}
                {isPdf ? (
                  <img
                    src={TRANSCOMIS_HEADER_LOGO_BASE64}
                    alt="TRANSCOMIS INTERNATIONAL"
                    style={{ height: '50px', marginBottom: 4 }}
                  />
                ) : (
                  <img
                    src="/assets/img/transcomis-logo-header.png"
                    alt="TRANSCOMIS INTERNATIONAL"
                    style={{ height: '50px', marginBottom: 4 }}
                  />
                )}
              </div>
              <div style={{ textAlign: 'right',  color: ' #9BC2E6', fontWeight: 700 }}>
                <p style={{ fontSize: '7pt', lineHeight: 1.1, margin: 0,  color: ' #9BC2E6' }}>
                  TECHNOLOGIE INFORMACITIQUE & SYSTEME D'INFORMATIONS | MATÉRIELS<br />
                  DE BUREAU ET CONSOMMABLES INFORMATIQUES | TRANSPORT LOGISTIQUE<br />
                  COMMERCE GÉNÉRAL | PRESTATIONS DE SERVICES DIVERS ...
                </p>
                <p style={{ fontSize: '7pt', marginTop: 4, lineHeight: 1.1, marginBottom: 0,  color: ' #9BC2E6', fontWeight: 700 }}>
                  TRANSCOMIS INTERNATIONAL, LA CULTURE DU TRAVAIL BIEN FAIT.
                </p>
              </div>
            </div>
            <div style={{ height: 3, background: '#f97316', width: '100%' }}></div>
            <div style={{ height: 2, background: '#1e40af', width: '100%', marginTop: 1 }}></div>
          </div>
          {/* === Fin Custom Header === */}
          {/* Header avec logo et slogan */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "32px 32px 0 32px" }}>
            {/* Logo : utiliser <img> si isPdf, sinon <Image> */}
            {details.invoiceLogo && (
              isPdf ? (
                <img src={details.invoiceLogo} width={140} height={100} alt={`Logo de ${sender.name}`} />
              ) : (
                <Image src={details.invoiceLogo} width={140} height={100} alt={`Logo de ${sender.name}`} />
              )
            )}
            {/* ...autres éléments... */}
          </div>
          {/* Présentation Propriétaire / Destinataire */}
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 32, margin: '32px 32px 0 32px'}}>
            {/* Propriétaire (Émetteur) */}
            <div style={{background: 'transparent', color: '#111', padding: 16, borderRadius: 8, width: '48%'}}>
              <div style={{fontWeight: 'bold', fontSize: 16, marginBottom: 4}}>FACTURE N°. {details.invoiceNumber}</div>
              <div style={{fontSize: 12, marginBottom: 4}}>Date : {new Date(details.invoiceDate).toLocaleDateString('fr-FR')}</div>
              <div style={{fontSize: 12, marginBottom: 4}}>Référence : {details.invoiceNumber}</div>
              <div style={{fontSize: 12, marginBottom: 4}}>Émis par : {sender.name}</div>
              <div style={{fontSize: 12, marginBottom: 4}}>{sender.address}</div>
              <div style={{fontSize: 12, marginBottom: 4}}>{sender.zipCode}, {sender.city}</div>
              <div style={{fontSize: 12, marginBottom: 4}}>{sender.country}</div>
              {sender.email && <div style={{fontSize: 12, marginBottom: 4}}>Email : {sender.email}</div>}
              {sender.phone && <div style={{fontSize: 12, marginBottom: 4}}>Contact : {sender.phone}</div>}
            </div>
            {/* Destinataire */}
            <div style={{background: 'transparent', color: '#111', padding: 16, borderRadius: 8, width: '48%', textAlign: 'right'}}>
              <div style={{fontWeight: 'bold', fontSize: 16, marginBottom: 4}}>{(receiver.name || '').toUpperCase()}</div>
              <div style={{fontWeight: 'bold', fontSize: 12, marginBottom: 4, textDecoration: 'underline'}}>DESTINATAIRE</div>
              <div style={{fontSize: 12, marginBottom: 4}}>{receiver.address || ''}</div>
              <div style={{fontSize: 12, marginBottom: 4}}>{receiver.zipCode || ''}, {receiver.city || ''}</div>
              <div style={{fontSize: 12, marginBottom: 4}}>{receiver.country || ''}</div>
              {receiver.email && <div style={{fontSize: 12, marginBottom: 4}}>Email : {receiver.email}</div>}
              {receiver.phone && <div style={{fontSize: 12, marginBottom: 4}}>Tél : {receiver.phone}</div>}
            </div>
          </div>
          {/* ...reste du contenu... */}
          {/* Items table */}
          <div style={{ marginTop: 32, padding: "0 32px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: "rgba(255, 255, 255, 0)" }}>
              <thead>
                <tr style={{ background: "#9BC2E6", color: "#fff" }}>
                  <th style={{ padding: 8, border: "1.5px solid #000" }}>#</th>
                  <th style={{ padding: 8, border: "1.5px solid #000" }}>ITEMS DESCRIPTIONS</th>
                  <th style={{ padding: 8, border: "1.5px solid #000" }}>QTY</th>
                  <th style={{ padding: 8, border: "1.5px solid #000" }}>PRIX U.</th>
                  <th style={{ padding: 8, border: "1.5px solid #000" }}>PRIX TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {details.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: 8, border: "1.5px solid #000", textAlign: "center" }}>{idx + 1}</td>
                    <td style={{ padding: 8, border: "1.5px solid #000" }}>{item.description || item.name}</td>
                    <td style={{ padding: 8, border: "1.5px solid #000", textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ padding: 8, border: "1.5px solid #000", textAlign: "right" }}>{item.unitPrice} {currency}</td>
                    <td style={{ padding: 8, border: "1.5px solid #000", textAlign: "right" }}>{item.total} {currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", padding: "0 32px" }}>
            <table style={{ minWidth: 280, fontSize: 13, background: "rgba(255, 255, 255, 0)" }}>
              <tbody>
                <tr>
                  <td style={{ padding: 4 }}>Sous-total :</td>
                  <td style={{ padding: 4, textAlign: "right" }}>{formatNumberWithCommas(Number(details.subTotal))} {currency}</td>
                </tr>
                {details.discountDetails?.amount != undefined && details.discountDetails?.amount > 0 && (
                  <tr>
                    <td style={{ padding: 4 }}>Remise :</td>
                    <td style={{ padding: 4, textAlign: "right" }}>
                      {details.discountDetails.amountType === "amount"
                        ? `- ${details.discountDetails.amount} ${currency}`
                        : `- ${details.discountDetails.amount}%`}
                    </td>
                  </tr>
                )}
                {details.taxDetails?.amount != undefined && details.taxDetails?.amount > 0 && (
                  <tr>
                    <td style={{ padding: 4 }}>Taxe :</td>
                    <td style={{ padding: 4, textAlign: "right" }}>
                      {details.taxDetails.amountType === "amount"
                        ? `+ ${details.taxDetails.amount} ${currency}`
                        : `+ ${details.taxDetails.amount}%`}
                    </td>
                  </tr>
                )}
              {details.shippingDetails?.cost != undefined && details.shippingDetails?.cost > 0 && (
                <tr>
                  <td style={{ padding: 4 }}>Livraison :</td>
                  <td style={{ padding: 4, textAlign: "right" }}>
                    {details.shippingDetails.costType === "amount"
                      ? `+ ${details.shippingDetails.cost} ${currency}`
                      : `+ ${details.shippingDetails.cost}%`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Notes, paiement, signature */}
        <div style={{ marginTop: 32 }}>
          {details.additionalNotes && (
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: "#0056a3", fontWeight: 600 }}>Notes :</span> {details.additionalNotes}
            </div>
          )}
          {details.paymentTerms && (
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: "#0056a3", fontWeight: 600 }}>Modalités de paiement :</span> {details.paymentTerms}
            </div>
          )}
          <div style={{ fontSize: 12, color: "#0056a3", marginTop: 16 }}>
              Arrêtée la présente FACTURE à la Somme de :<br />
              <span style={{ fontWeight: 600 }}>
                {totalInWords} ({formatNumberWithCommas(totalValid)}) Francs CFA TTC.
              </span>
          </div>
          {/* Signature alignée à droite */}
          {details?.signature?.data && isDataUrl(details.signature.data) ? (
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{textAlign: 'right'}}>
                <span style={{ fontWeight: 600 }}>Signature :</span><br />
                {isPdf ? (
                  <img src={details.signature.data} width={120} height={60} alt={`Signature de ${sender.name}`} />
                ) : (
                  <Image src={details.signature.data} width={120} height={60} alt={`Signature de ${sender.name}`} />
                )}
              </div>
            </div>
          ) : details.signature?.data ? (
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{textAlign: 'right'}}>
                <span style={{ fontWeight: 600 }}>Signature :</span><br />
                <span style={{ fontSize: 30, fontFamily: `${details.signature.fontFamily || 'cursive'}, cursive`, color: "black" }}>{details.signature.data}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        
        <div style={{ marginTop: 48, padding: '12px 0', textTransform: 'uppercase', fontWeight: 700 }}>
        <div style={{ height: 2, background: '#1e40af', width: '100%', marginTop: 1 }}></div>
          <div style={{ textAlign: 'center', fontSize: 11, color: ' #9BC2E6', fontWeight: 700, letterSpacing: 1 }}>
            TRANSCOMIS INTERNATIONAL SARL - CAPITAL SOCIAL : 1 000 000 F CFA - SIEGE SOCIAL : SECT. 09 – OUAGADOUGOU – BURKINA FASO
          </div>
          <div style={{ textAlign: 'center', fontSize: 10, color: ' #9BC2E6', marginTop: 2, fontWeight: 700 }}>
            07 BP 5391 OUAGA 07 | TEL : +226 74 16 11 00 # 70 46 11 19 | NO IFU : 00133367M | RCCM : BFOUA2020B1844
          </div>
          <div style={{ textAlign: 'center', fontSize: 10, color: ' #9BC2E6', marginTop: 2, fontWeight: 700 }}>
            E-MAIL : INFO@TRANSCOMIS.COM – COMPTE BANCAIRE : BF202 – 01001 – 000100620501 - 68 | WENDKUNI BANK INTERNATIONAL
          </div>
        </div>

        </div> {/* Fin du contenu principal relatif */}
      </div>
    </InvoiceLayout>
  );
};

export default InvoiceTemplate3;
