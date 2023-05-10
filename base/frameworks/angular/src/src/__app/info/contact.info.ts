export const contactInfo = {
  email: {
    icon: 'hoggax-icon-email',
    forGeneral: {
      text: 'info@hoggax.com',
      link: 'mailto:info@hoggax.com',
    },
    forCompanies: {
      text: 'empresas@hoggax.com',
      link: 'mailto:empresas@hoggax.com',
    },
    forOwners: {
      text: 'propietarios@hoggax.com',
      link: 'mailto:propietarios@hoggax.com',
    },
    forEnsurances: {
      text: 'seguros@hoggax.com',
      link: 'mailto:seguros@hoggax.com',
    },
  },
  whatsapp: {
    icon: 'hoggax-icon-whatsapp',
    forGeneral: {
      text: '+54 9 11 5850 4262',
      link: 'https://wa.me/5491158504262',
      linkForSaveQuotation: (rent: string, expenses: string, term: string) => {
        return `${contactInfo.whatsapp.forGeneral.link}?text=Quiero que envíen a mi casilla de mail la cotización de mi garantía Hoggax por un alquiler de $${rent}, expensas $${expenses} y un plazo de ${term} años.`;
      },
      linkForOtherPaymentMethods: (rent: string, expenses: string, term: string) => {
        return `${contactInfo.whatsapp.forGeneral.link}?text=Quiero conocer otras alternativas de pago de mi garantía Hoggax por un alquiler de $${rent}, expensas $${expenses} y un plazo de ${term} años.`;
      },
    },
  },
  phone: {
    icon: 'hoggax-icon-phone',
    forGeneral: {
      text: '0810 220 2825',
      textAlt: '0810 220 AVAL (2825)',
      link: 'tel:08102202825',
    },
  },
  facebook: {
    icon: 'hoggax-icon-facebook',
    forGeneral: {
      link: 'https://www.facebook.com/hoggax',
    },
  },
  instagram: {
    icon: 'hoggax-icon-instagram',
    forGeneral: {
      link: 'https://www.instagram.com/hoggax/',
    },
  },
  linkedin: {
    icon: 'hoggax-icon-linkedin',
    forGeneral: {
      link: 'https://ar.linkedin.com/company/hoggax',
    },
  },
  addresses: {
    icon: 'hoggax-icon-location',
    forGeneral: [
      {
        text: 'Av. Córdoba 1255 piso 8, CABA, Argentina',
      },
      {
        text: 'Av. Cabildo 4414, CABA, Argentina',
      },
    ],
  },
  fiscalData: {
    link: 'http://qr.afip.gob.ar/?qr=d-1rPc1Jp2cHof7Nif1GWQ,,',
  },
}
