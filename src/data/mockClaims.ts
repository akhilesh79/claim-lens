import type { ClaimDecision } from '@/types/claims';

export const mockClaimDecision: ClaimDecision = {
  job_id: '3e3ff05a-ecc0-4180-840f-60787c738f22',
  claim_id: 'TEST_001',
  package_code: 'SB039A',
  report: {
    status: 'REJECTED',
    confidence: 80,
    riskScore: 'High',
    keyReasons: [
      'Discharge summary present — Discharge summary is mandatory.',
      'Pre-authorization form present — Pre-authorization form is mandatory.',
      'Operative notes present — Operative notes are mandatory for surgical packages.',
      'X-ray (pre-op) must be present verified ✓',
      'Implant barcode sticker present — Implant sticker (REF/LOT/SN) is mandatory for arthroplasty claims.',
    ],
    complianceScore: 23,
    summary: {
      id: 'TEST_001',
      patient: {
        name: 'Ee PAG j HM',
        age: 'N/A',
        gender: 'N/A',
      },
      hospital: 'N/A',
      admissionDate: 'N/A',
      dischargeDate: 'N/A',
      lengthOfStay: 0,
      packageType: 'SB039A',
      diagnosis: 'ACS: NSTEMI -',
      procedure: 'N/A',
      claimedAmount: 0,
    },
    documentInventory: {
      documents: [
        {
          name: 'Discharge Summary',
          present: false,
        },
        {
          name: 'Pre-Authorization Form',
          present: false,
        },
        {
          name: 'Operation Theatre Notes',
          present: false,
        },
        {
          name: 'Investigation Reports (X-ray)',
          present: true,
        },
        {
          name: 'Implant Invoice & Sticker',
          present: false,
        },
        {
          name: 'Anaesthesia Record',
          present: false,
        },
        {
          name: 'Consent Forms',
          present: false,
        },
      ],
      duplicateDocs: 0,
      lowQualityDocs: 0,
    },
    visualProofs: [
      {
        type: 'Hospital Stamp',
        detected: true,
      },
      {
        type: 'Doctor Signature',
        detected: true,
      },
      {
        type: 'Implant Sticker',
        detected: false,
      },
      {
        type: 'QR / Barcode',
        detected: false,
      },
      {
        type: 'Pharmacy Seal',
        detected: false,
      },
    ],
    stgRules: [
      {
        rule: 'Discharge summary present',
        expected: 'See STG guidelines',
        observed: 'Discharge summary is mandatory.',
        status: 'fail',
      },
      {
        rule: 'Pre-authorization form present',
        expected: 'See STG guidelines',
        observed: 'Pre-authorization form is mandatory.',
        status: 'warn',
      },
      {
        rule: 'Operative notes present',
        expected: 'See STG guidelines',
        observed: 'Operative notes are mandatory for surgical packages.',
        status: 'fail',
      },
      {
        rule: 'X-ray (pre-op) must be present',
        expected: 'See STG guidelines',
        observed: 'xray_image found.',
        status: 'pass',
      },
      {
        rule: 'Implant barcode sticker present',
        expected: 'See STG guidelines',
        observed: 'Implant sticker (REF/LOT/SN) is mandatory for arthroplasty claims.',
        status: 'fail',
      },
      {
        rule: 'Anaesthesia notes present',
        expected: 'See STG guidelines',
        observed: 'Anaesthesia record must be submitted for surgical claims.',
        status: 'warn',
      },
      {
        rule: 'Pre-operative investigations present',
        expected: 'See STG guidelines',
        observed: 'Pre-op labs (CBC, BT/CT, RFT, ECG) must be submitted.',
        status: 'warn',
      },
      {
        rule: 'Admission before discharge',
        expected: 'See STG guidelines',
        observed: 'Cannot verify: admission or discharge date missing.',
        status: 'fail',
      },
      {
        rule: 'Procedure within admission–discharge window',
        expected: 'See STG guidelines',
        observed: 'Procedure date not found in documents.',
        status: 'fail',
      },
      {
        rule: 'Length of stay 5–14 days',
        expected: 'See STG guidelines',
        observed: 'Length of stay cannot be computed (dates missing).',
        status: 'warn',
      },
      {
        rule: 'Hospital stamp on discharge summary',
        expected: 'See STG guidelines',
        observed: 'hospital_stamp detected.',
        status: 'pass',
      },
      {
        rule: 'Doctor/Surgeon signature on operative notes',
        expected: 'See STG guidelines',
        observed: 'doctor_signature detected.',
        status: 'pass',
      },
      {
        rule: 'Diagnosis consistent with joint disease',
        expected: 'See STG guidelines',
        observed: 'Diagnosis must be consistent with joint replacement indication.',
        status: 'warn',
      },
      {
        rule: 'Implant details documented',
        expected: 'See STG guidelines',
        observed: "Diagnosis keyword match: ['stem'].",
        status: 'pass',
      },
      {
        rule: 'Patient name extractable',
        expected: 'See STG guidelines',
        observed: "Field 'patient_name' found: Ee PAG j HM.",
        status: 'pass',
      },
      {
        rule: 'Admission date documented',
        expected: 'See STG guidelines',
        observed: 'Admission date must be clearly documented.',
        status: 'warn',
      },
      {
        rule: 'Discharge date documented',
        expected: 'See STG guidelines',
        observed: 'Discharge date must be clearly documented.',
        status: 'warn',
      },
      {
        rule: 'Procedure date documented',
        expected: 'See STG guidelines',
        observed: 'The date of surgery must be extractable from submitted records.',
        status: 'warn',
      },
    ],
    timeline: [
      {
        day: 1,
        label: 'Admission',
        description: 'Admitted on N/A',
      },
      {
        day: 1,
        label: 'Discharge',
        description: 'Discharged on N/A',
      },
    ],
    financialItems: [
      {
        category: 'Claimed Amount',
        amount: 0,
        status: 'ok',
      },
    ],
    fraudSignals: [
      {
        description: 'Critical document missing: [R001] Discharge summary is mandatory.',
      },
      {
        description: 'Critical document missing: [R003] Operative notes are mandatory for surgical packages.',
      },
      {
        description:
          'Critical document missing: [R005] Implant sticker (REF/LOT/SN) is mandatory for arthroplasty claims.',
      },
      {
        description: 'Critical document missing: [R008] Cannot verify: admission or discharge date missing.',
      },
      {
        description: 'Critical document missing: [R009] Procedure date not found in documents.',
      },
    ],
    recommendedActions: [
      'Resolve: Discharge summary is mandatory.',
      'Resolve: Operative notes are mandatory for surgical packages.',
      'Resolve: Implant sticker (REF/LOT/SN) is mandatory for arthroplasty claims.',
      'Resolve: Cannot verify: admission or discharge date missing.',
      'Resolve: Procedure date not found in documents.',
    ],
  },
};
