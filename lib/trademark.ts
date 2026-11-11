export const TRADEMARK = {
  mark: "Beauty Room",
  registeredMark: "Beauty Room®",
  number: "193453",
  applicationSerialNo: "193453",
  form: "TMR-1 Form",
  serialNo: "57267",
  journalNo: "335",
  classNo: "35",
  territory: "Bangladesh",
  issuingGovernment: "Government of the People's Republic of Bangladesh",
  issuingAuthority: "Department of Patents, Designs & Trade Marks",
  issuingMinistry: "Ministry of Industries",
  issuingOfficeAddress: "Shilpa Bhaban, 91, Motijheel C/A, Dhaka-1000",
  certificateTitle: "Certificate of Registration of Trademark [Rule 30(1)]",
  applicationDate: "2024-12-08",
  applicationDateLabel: "08 December 2024",
  certificateDate: "2025-12-04",
  certificateDateLabel: "04 December 2025",
  proprietorName: "Riyad Sarkar",
  proprietorRole: "Proprietor",
  proprietorAddress: "ZN Tower, 2nd Floor, Plot 2, Road 8, Gulshan 2, Dhaka-1212",
  printedEntityDescription: "Multinational Consumer Goods and Personal Care Company",
  goodsAndServices:
    "online retail and wholesale services featuring cosmetics, skincare, makeup, beauty and personal care products",
  registrarName: "Md. Obaidur Rahman",
  registrarTitle: "Deputy Registrar (Trademarks)",
  registrationTerm:
    "Registration is given for 7 years, from the above-mentioned date and may then be renewed for a period of 10 years, and also at the expiration of each period of 10 years, thereafter (See Section 22 of the Trademarks Act, 2009).",
  certificateProceedingLimit:
    "This certificate is not for use in legal proceeding or for obtaining registration abroad.",
  ownershipChangeNote:
    "Upon any change of ownership of this Trade Mark, or change in address, application should at once be made to Registrar for the change.",
  certificatePreviewSrc: "/brand-protection/certificate-tm-193453.webp",
  certificatePreviewAlt:
    "Preview of Bangladesh Certificate of Registration of Trademark No. 193453 for Beauty Room in Class 35",
  certificateWidth: 4746,
  certificateHeight: 7016,
  symbolScope: "Bangladesh Class 35",
  noticeShort: "Beauty Room® is a registered trademark in Bangladesh (Class 35).",
} as const

export const TRADEMARK_FACTS = [
  { label: "Mark", value: TRADEMARK.mark },
  { label: "Trademark No.", value: TRADEMARK.number },
  { label: "Class", value: TRADEMARK.classNo },
  { label: "Territory", value: TRADEMARK.territory },
  { label: "Journal No.", value: TRADEMARK.journalNo },
  { label: "Application date", value: TRADEMARK.applicationDateLabel },
  { label: "Certificate date", value: TRADEMARK.certificateDateLabel },
  { label: "Proprietor", value: `${TRADEMARK.proprietorRole}, ${TRADEMARK.proprietorName}` },
  { label: "Proprietor address", value: TRADEMARK.proprietorAddress },
  { label: "Printed description", value: TRADEMARK.printedEntityDescription },
  { label: "Services", value: TRADEMARK.goodsAndServices },
  { label: "Issuing office", value: TRADEMARK.issuingAuthority },
] as const

export const TRADEMARK_NOTICE_LONG =
  "Beauty Room® is a registered trademark in Bangladesh in Class 35 for online retail and wholesale services featuring cosmetics, skincare, makeup, beauty and personal care products."
