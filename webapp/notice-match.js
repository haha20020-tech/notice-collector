window.NOTICE_REMOTE_JSON_URL = 'https://raw.githubusercontent.com/haha20020-tech/notice-collector/main/data/notices.json';
window.NOTICE_REMOTE_CSV_URL = 'https://raw.githubusercontent.com/haha20020-tech/notice-collector/main/data/list.csv';

/* Verified qualification rules for notice LH-2015122300021130 (from PDF p.1-11 & 대조표_1130.md).
 * Numbers and dates are exact copies of the official announcement PDF — never altered. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.NOTICE_RULES = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : window, function () {
  'use strict';

  var RULE_1130 = {
    notice_key: 'LH-2015122300021130',
    pan_id: '2015122300021130',
    wp_post_url: 'https://kkeobi.goppama.com/suwon-homaesil21-godeung2-happy-202611/',
    extract_status: '원문 대조 완료 (공고문 PDF 31쪽 · 대조표_1130.md)',
    posted_date: '2026-11-23',
    recruit_mode: '입주자 모집 (기존 단지 · 입주자격완화 · 선계약 후검증)',
    income_basis_name: '전년도 도시근로자 가구원수별 가구당 월평균소득 기준',
    apply_start_pdf: '2026-12-03',
    apply_end_pdf: '2026-12-04',
    apply_time_text: '2026.12.03.(목) 10:00 ~ 12.04.(금) 16:00 (인터넷·모바일 청약 전용)',
    schedule: {
      apply: '2026-12-03(목) 10:00 ~ 12-04(금) 16:00 (온라인·모바일)',
      doc_target_announce: '2026-12-08(화) 17:00 이후',
      doc_submit: '2026-12-09(수) 10:00 ~ 12-14(월) 16:00 (온라인·등기우편)',
      winner_announce: '2026-12-22(화) 16:00 이후',
      contract: '2026-12-30(수) 10:00 ~ 16:00 (수원권주거복지지사 현장계약)',
      move_in: '2027년 3월 예정 (입주기간 60일)'
    },
    sido: '경기',
    sigungu: ['수원시'],
    adjacent_sigungu: ['용인시', '화성시', '의왕시', '안산시'],
    metro_sido: ['경기', '서울', '인천'],
    excluded_groups: ['대학생', '주거급여수급자', '고령자'],
    subscription_rule: '입주 전까지 주택청약종합저축(청약저축 포함) 가입사실 증명 (신청 시 미가입자도 신청 가능)',
    supply_units: [
      {
        complex: '수원호매실21단지(A-7블록)',
        type_name: '36형',
        target: '신혼부부·한부모가족',
        target_group: 'newlywed',
        units: 23,
        deposit_won: 69200000,
        contract_deposit_won: 3460000,
        monthly_rent_won: 322930,
        max_residence: '무자녀 10년, 자녀 1명 이상 14년'
      },
      {
        complex: '수원고등2단지(C-1블록)',
        type_name: '36A',
        target: '청년 (소득 無)',
        target_group: 'youth_no_income',
        units: 13,
        deposit_won: 62220000,
        contract_deposit_won: 3111000,
        monthly_rent_won: 305910,
        max_residence: '10년'
      },
      {
        complex: '수원고등2단지(C-1블록)',
        type_name: '36A',
        target: '청년 (소득 有)',
        target_group: 'youth_with_income',
        units: 13,
        deposit_won: 65880000,
        contract_deposit_won: 3294000,
        monthly_rent_won: 323910,
        max_residence: '10년'
      },
      {
        complex: '수원고등2단지(C-1블록)',
        type_name: '36A',
        target: '신혼부부·한부모가족',
        target_group: 'newlywed',
        units: 15,
        deposit_won: 73200000,
        contract_deposit_won: 3660000,
        monthly_rent_won: 359900,
        max_residence: '무자녀 10년, 자녀 1명 이상 14년'
      }
    ],
    total_units: 51,
    income_tables: {
      youth: {
        rank1: {
          limits: { 1: 4576036, 2: 6452897, 3: 8168429, 4: 8802202, 5: 9326985, 6: 9906263 },
          extra_per_person: 579278,
          pct_by_size: { 1: 120, 2: 110, 3: 100 }
        },
        rank2: {
          limits: { 1: 5338708, 2: 7626151, 3: 9802115, 4: 10562642, 5: 11192382, 6: 11887516 },
          extra_per_person: 695133,
          pct_by_size: { 1: 140, 2: 130, 3: 120 }
        },
        rank3: {
          limits: { 1: 5720045, 2: 8799405, 3: 12252644, 4: 13203303, 5: 13990478, 6: 14859395 },
          extra_per_person: 868917,
          pct_by_size: { 1: 150, 2: 150, 3: 150 }
        }
      },
      newlywed_single: {
        rank1: {
          limits: { 2: 6452897, 3: 8168429, 4: 8802202, 5: 9326985, 6: 9906263 },
          extra_per_person: 579278,
          pct_by_size: { 2: 110, 3: 100 }
        },
        rank2: {
          limits: { 2: 7626151, 3: 9802115, 4: 10562642, 5: 11192382, 6: 11887516 },
          extra_per_person: 695133,
          pct_by_size: { 2: 130, 3: 120 }
        },
        rank3: {
          limits: { 2: 8799405, 3: 12252644, 4: 13203303, 5: 13990478, 6: 14859395 },
          extra_per_person: 868917,
          pct_by_size: { 2: 150, 3: 150 }
        }
      },
      newlywed_dual: {
        rank1: {
          limits: { 2: 7626151, 3: 9802115, 4: 10562642, 5: 11192382, 6: 11887516 },
          extra_per_person: 695134,
          pct_by_size: { 2: 130, 3: 120 }
        },
        rank2: {
          limits: { 2: 8212778, 3: 10618958, 4: 11442863, 5: 12125081, 6: 12878142 },
          extra_per_person: 753061,
          pct_by_size: { 2: 140, 3: 130 }
        },
        rank3: {
          limits: { 2: 8799405, 3: 12252644, 4: 13203303, 5: 13990478, 6: 14859395 },
          extra_per_person: 868917,
          pct_by_size: { 2: 150, 3: 150 }
        }
      },
      pct_table: {
        100: { 3: 8168429, 4: 8802202, 5: 9326985, 6: 9906263, extra: 579278 },
        110: { 2: 6452897, 3: 8985272, 4: 9682422, 5: 10259684, 6: 10896889, extra: null },
        120: { 1: 4576036, 2: 7039524, 3: 9802115, 4: 10562642, 5: 11192382, 6: 11887516, extra: 695134 },
        130: { 2: 7626151, 3: 10618958, 4: 11442863, 5: 12125081, 6: 12878142, extra: 753061 },
        140: { 2: 8212778, 3: 11435801, 4: 12323083, 5: 13057779, 6: 13868768, extra: null }
      }
    },
    asset_limits: {
      youth: {
        0: { asset_won: 251000000, car_won: 45420000 },
        1: { asset_won: 276000000, car_won: 49960000 },
        2: { asset_won: 301000000, car_won: 54510000 }
      },
      newlywed: {
        0: { asset_won: 345000000, car_won: 45420000 },
        1: { asset_won: 379000000, car_won: 49960000 },
        2: { asset_won: 413000000, car_won: 54510000 }
      }
    }
  };

  return {
    'LH-2015122300021130': RULE_1130
  };
});

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MANUAL_DEFAULTS_202607 = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : window, function () {
  // 출처: 공공주택 업무매뉴얼 (2026.07, 신입직원 양성과정)
  // 주의: 이 데이터는 공고별 세부 조건이 아직 수집되지 않았을 때 참고용 기본 기준을 표시하기 위한 것입니다.
  //       기본값만으로 '신청 가능'을 단정하지 않습니다.

  // <표7> 전년도 도시근로자 가구원수별 가구당 월평균소득 (원, p.445, 1~8인)
  const URBAN_WORKER_INCOME = {
    50: [2669354, 3519762, 4084215, 4401101, 4663493, 4953132, 5242771, 5532410],
    60: [3050690, 4106389, 4901057, 5281321, 5596191, 5943758, 6291325, 6638891],
    70: [3432027, 4693016, 5717900, 6161541, 6528890, 6934384, 7339879, 7745373],
    80: [3813363, 5279643, 6534743, 7041762, 7461588, 7925010, 8388433, 8851855],
    90: [4194699, 5866270, 7351586, 7921982, 8394287, 8915637, 9436987, 9958337],
    100: [4576036, 6452897, 8168429, 8802202, 9326985, 9906263, 10485541, 11064819],
    110: [4957372, 7039524, 8985272, 9682422, 10259684, 10896889, 11534095, 12171301],
    120: [5338708, 7626151, 9802115, 10562642, 11192382, 11887516, 12582649, 13277783],
    130: [5720045, 8212778, 10618958, 11442863, 12125081, 12878142, 13631203, 14384265],
    140: [6101381, 8799405, 11435801, 12323083, 13057779, 13868768, 14679757, 15490747],
    150: [6482717, 9386032, 12252644, 13203303, 13990478, 14859395, 15728312, 16597229],
    160: [6864053, 9972659, 13069486, 14083523, 14923176, 15850021, 16776866, 17703710],
    170: [7245390, 10559286, 13886329, 14963743, 15855875, 16840647, 17825420, 18810192],
    200: [8389399, 12319167, 16336858, 17604404, 18653970, 19812526, 20971082, 22129638]
  };

  // <표8> 전년도 기준 중위소득 (통합공공임대, 원, p.446, 1~6인)
  const MEDIAN_INCOME = {
    30: [769271, 1259788, 1607711, 1948421, 2267016, 2566786],
    50: [1282119, 2099646, 2679518, 3247369, 3778360, 4277976],
    70: [1794967, 2939504, 3751325, 4546317, 5289703, 5989166],
    100: [2564238, 4199292, 5359036, 6494738, 7556719, 8555952],
    110: [2820662, 4619221, 5894940, 7144212, 8312391, 9411547],
    120: [3077086, 5039150, 6430843, 7793686, 9068063, 10267142],
    130: [3333509, 5459080, 6966747, 8443159, 9823735, 11122738],
    150: [3846357, 6298938, 8038554, 9742107, 11335079, 12833928],
    160: [4102781, 6718867, 8574458, 10391581, 12090750, 13689523],
    170: [4359205, 7138796, 9110361, 11041055, 12846422, 14545118],
    180: [4615628, 7558726, 9646265, 11690528, 13602094, 15400714],
    190: [4872052, 7978655, 10182168, 12340002, 14357766, 16256309],
    200: [5128476, 8398584, 10718072, 12989476, 15113438, 17111904]
  };

  const TYPES = {
    permanent: {
      key: 'permanent',
      label: '영구임대',
      incomeBase: 'urban_worker',
      incomeBaseLabel: '도시근로자 월평균소득',
      pages: 'p.6~10, p.426',
      summary: {
        incomeText: '1순위 70% / 2순위 일반 50% / 2순위 장애인 100% 이하',
        assetText: '총자산 24,500만원 이하',
        carText: '자동차 4,542만원 이하',
        representativeIncomePct: 70,
        representativeAssetManwon: 24500,
        representativeCarManwon: 4542,
        assetKind: '총자산'
      },
      ranks: [
        {
          rank: '1순위 (수급자·한부모 등)',
          incomePct: null,
          incomePctText: '자격별 별도 / 유공·장애인 등 70% 이하 (1인 90%, 2인 80%)',
          singleAdj: '+20%p (90%)',
          twoAdj: '+10%p (80%)',
          assetManwon: 24500,
          assetNote: '출산 1인 27,000만 / 2인 29,400만',
          carManwon: 4542,
          carNote: '출산 1인 4,996만 / 2인 5,451만'
        },
        {
          rank: '2순위 (일반)',
          incomePct: 50,
          incomePctText: '50% 이하 (1인 70%, 2인 60%)',
          singleAdj: '+20%p (70%)',
          twoAdj: '+10%p (60%)',
          assetManwon: 24500,
          assetNote: '출산 1인 27,000만 / 2인 29,400만',
          carManwon: 4542,
          carNote: '출산 1인 4,996만 / 2인 5,451만'
        },
        {
          rank: '2순위 (장애인)',
          incomePct: 100,
          incomePctText: '100% 이하 (1인 120%, 2인 110%)',
          singleAdj: '+20%p (120%)',
          twoAdj: '+10%p (110%)',
          assetManwon: 24500,
          assetNote: '출산 1인 27,000만 / 2인 29,400만',
          carManwon: 4542,
          carNote: '출산 1인 4,996만 / 2인 5,451만'
        }
      ],
      notes: '1인 가구 +20%p, 2인 가구 +10%p 가산이 적용됩니다.'
    },

    national: {
      key: 'national',
      label: '국민임대',
      incomeBase: 'urban_worker',
      incomeBaseLabel: '도시근로자 월평균소득',
      pages: 'p.22~27, p.38, p.426',
      summary: {
        incomeText: '일반 70% 이하 (50㎡ 미만 우선공급 50% 이하)',
        assetText: '총자산 34,500만원 이하',
        carText: '자동차 4,542만원 이하',
        representativeIncomePct: 70,
        representativeAssetManwon: 34500,
        representativeCarManwon: 4542,
        assetKind: '총자산'
      },
      ranks: [
        {
          rank: '일반공급',
          incomePct: 70,
          incomePctText: '70% 이하 (1인 90%, 2인 80%)',
          singleAdj: '+20%p (90%)',
          twoAdj: '+10%p (80%)',
          assetManwon: 34500,
          assetNote: '출산 1인 37,900만 / 2인 41,300만',
          carManwon: 4542,
          carNote: '출산 1인 4,996만 / 2인 5,451만'
        },
        {
          rank: '전용 50㎡ 미만 신규 우선공급',
          incomePct: 50,
          incomePctText: '50% 이하 (1인 70%, 2인 60%)',
          singleAdj: '+20%p (70%)',
          twoAdj: '+10%p (60%)',
          assetManwon: 34500,
          assetNote: '출산 1인 37,900만 / 2인 41,300만',
          carManwon: 4542,
          carNote: '출산 1인 4,996만 / 2인 5,451만'
        }
      ],
      notes: '전용면적·우선공급 유형에 따라 50% 또는 70%(1인 +20%p, 2인 +10%p) 기준이 달라집니다.'
    },

    happy: {
      key: 'happy',
      label: '행복주택',
      incomeBase: 'urban_worker',
      incomeBaseLabel: '도시근로자 월평균소득',
      pages: 'p.62~90, p.426',
      summary: {
        incomeText: '100% 이하 (1인 120%·2인 110%·맞벌이 120~130%)',
        assetText: '대학생 10,800만 / 청년 25,100만 / 그 외 34,500만원 이하',
        carText: '대학생 미소유 / 그 외 4,542만원 이하',
        representativeIncomePct: 100,
        representativeAssetManwon: 34500,
        representativeCarManwon: 4542,
        assetKind: '총자산'
      },
      ranks: [
        {
          rank: '대학생 계층 (본인+부모)',
          incomePct: 100,
          incomePctText: '100% 이하 (1인 120%, 2인 110%)',
          singleAdj: '+20%p (120%)',
          twoAdj: '+10%p (110%)',
          assetManwon: 10800,
          assetNote: '대학생 본인 기준',
          carManwon: 0,
          carNote: '자동차 미소유'
        },
        {
          rank: '청년 계층',
          incomePct: 100,
          incomePctText: '100% 이하 (1인 120%, 2인 110%)',
          singleAdj: '+20%p (120%)',
          twoAdj: '+10%p (110%)',
          assetManwon: 25100,
          assetNote: '청년 기준',
          carManwon: 4542,
          carNote: '출산 시 가산 동일'
        },
        {
          rank: '신혼부부·한부모 계층',
          incomePct: 100,
          incomePctText: '100% 이하 (맞벌이 120%, 2인 110%·맞벌이 130%)',
          singleAdj: '-',
          twoAdj: '110% (맞벌이 130%)',
          assetManwon: 34500,
          assetNote: '출산 시 +10/+20%p 가산',
          carManwon: 4542,
          carNote: '출산 시 가산 동일'
        },
        {
          rank: '고령자·산단근로자·창업지원',
          incomePct: 100,
          incomePctText: '100% 이하 (1인 120%, 2인 110%, 맞벌이 120%·2인 130%)',
          singleAdj: '+20%p (120%)',
          twoAdj: '+10%p (110%)',
          assetManwon: 34500,
          assetNote: '출산 시 가산 동일',
          carManwon: 4542,
          carNote: '출산 시 가산 동일'
        }
      ],
      notes: '공급 계층(대학생·청년·신혼·고령자 등)별로 총자산 및 자동차 기준이 다릅니다.'
    },

    integrated: {
      key: 'integrated',
      label: '통합공공임대',
      incomeBase: 'median_income',
      incomeBaseLabel: '기준 중위소득',
      pages: 'p.102~133, p.426, p.446',
      summary: {
        incomeText: '우선공급 중위소득 100% / 일반공급 150% 이하',
        assetText: '총자산 34,500만원 이하',
        carText: '자동차 4,542만원 이하',
        representativeIncomePct: 150,
        representativeAssetManwon: 34500,
        representativeCarManwon: 4542,
        assetKind: '총자산'
      },
      ranks: [
        {
          rank: '우선공급',
          incomePct: 100,
          incomePctText: '기준 중위소득 100% 이하 (1인 120%, 2인 110%)',
          singleAdj: '+20%p (120%)',
          twoAdj: '+10%p (110%)',
          assetManwon: 34500,
          assetNote: '출산 1인 37,900만 / 2인 41,300만',
          carManwon: 4542,
          carNote: '출산 1인 4,996만 / 2인 5,451만'
        },
        {
          rank: '일반공급',
          incomePct: 150,
          incomePctText: '기준 중위소득 150% 이하 (1인 170%, 2인 160%, 맞벌이 신혼 +30%p)',
          singleAdj: '+20%p (170%)',
          twoAdj: '+10%p (160%)',
          assetManwon: 34500,
          assetNote: '출산 1인 37,900만 / 2인 41,300만',
          carManwon: 4542,
          carNote: '출산 1인 4,996만 / 2인 5,451만'
        }
      ],
      notes: '통합공공임대는 도시근로자 월평균소득이 아니라 기준 중위소득(<표8>)을 사용합니다. 출산 가구는 1인 +10%p, 2인 이상 +20%p 가산됩니다.'
    },

    purchased_general: {
      key: 'purchased_general',
      label: '일반 매입임대',
      incomeBase: 'urban_worker',
      incomeBaseLabel: '도시근로자 월평균소득',
      pages: 'p.157~158, p.426',
      summary: {
        incomeText: '1순위 70%(장애인 등) / 2순위 일반 50%·장애인 100% 이하',
        assetText: '총자산 24,500만원 이하',
        carText: '자동차 4,542만원 이하',
        representativeIncomePct: 70,
        representativeAssetManwon: 24500,
        representativeCarManwon: 4542,
        assetKind: '총자산'
      },
      ranks: [
        {
          rank: '1순위 (수급자·한부모·시급·저소득 고령자 / 장애인)',
          incomePct: 70,
          incomePctText: '수급자 등 별도 / 장애인 70% 이하 (1인 90%, 2인 80%)',
          singleAdj: '+20%p (90%)',
          twoAdj: '+10%p (80%)',
          assetManwon: 24500,
          assetNote: '국민·영구임대 계열 기준',
          carManwon: 4542,
          carNote: '비영업용 자동차 기준'
        },
        {
          rank: '2순위 (일반)',
          incomePct: 50,
          incomePctText: '50% 이하 (1인 70%, 2인 60%)',
          singleAdj: '+20%p (70%)',
          twoAdj: '+10%p (60%)',
          assetManwon: 24500,
          assetNote: '총자산 24,500만원 이하',
          carManwon: 4542,
          carNote: '자동차 4,542만원 이하'
        },
        {
          rank: '2순위 (장애인)',
          incomePct: 100,
          incomePctText: '100% 이하 (1인 120%, 2인 110%)',
          singleAdj: '+20%p (120%)',
          twoAdj: '+10%p (110%)',
          assetManwon: 24500,
          assetNote: '총자산 24,500만원 이하',
          carManwon: 4542,
          carNote: '자동차 4,542만원 이하'
        }
      ],
      notes: '제목에서 유형이 세부 구분되지 않은 매입임대는 일반 매입임대 기준을 우선 참고로 표시합니다.'
    },

    purchased_youth: {
      key: 'purchased_youth',
      label: '청년 매입임대',
      incomeBase: 'urban_worker',
      incomeBaseLabel: '도시근로자 월평균소득',
      pages: 'p.186, p.188, p.426',
      summary: {
        incomeText: '1순위 수급 등 / 2순위(본인+부모) 100% / 3순위(본인) 1인 120% 이하',
        assetText: '2순위 34,500만원 / 3순위 25,100만원 이하',
        carText: '자동차 4,542만원 이하',
        representativeIncomePct: 100,
        representativeAssetManwon: 25100,
        representativeCarManwon: 4542,
        assetKind: '총자산'
      },
      ranks: [
        {
          rank: '1순위 (수급자·한부모·차상위)',
          incomePct: null,
          incomePctText: '수급자·한부모가족·차상위계층 자격확인',
          singleAdj: '-',
          twoAdj: '-',
          assetManwon: null,
          assetNote: '자격 확인 기준',
          carManwon: null,
          carNote: '자격 확인 기준'
        },
        {
          rank: '2순위 (본인+부모 합산)',
          incomePct: 100,
          incomePctText: '100% 이하 (1인 120% 457만원, 2인 110% 645만원, 3인 816만원)',
          singleAdj: '+20%p (120%)',
          twoAdj: '+10%p (110%)',
          assetManwon: 34500,
          assetNote: '본인+부모 총자산',
          carManwon: 4542,
          carNote: '자동차 4,542만원 이하'
        },
        {
          rank: '3순위 (본인 단독)',
          incomePct: 120,
          incomePctText: '본인 1인 120% 이하 (4,576,036원)',
          singleAdj: '120%',
          twoAdj: '-',
          assetManwon: 25100,
          assetNote: '본인 총자산',
          carManwon: 4542,
          carNote: '자동차 4,542만원 이하'
        }
      ],
      notes: '청년 매입임대는 순위별로 부모 포함 여부와 총자산 한도(34,500만 vs 25,100만)가 다릅니다.'
    },

    purchased_newlywed_1: {
      key: 'purchased_newlywed_1',
      label: '신혼·신생아 매입임대Ⅰ',
      incomeBase: 'urban_worker',
      incomeBaseLabel: '도시근로자 월평균소득',
      pages: 'p.199~200, p.426',
      summary: {
        incomeText: '1~4순위 70% 이하 (맞벌이 90% 이하, 1인 +20%p·2인 +10%p)',
        assetText: '총자산 34,500만원 이하',
        carText: '자동차 4,542만원 이하',
        representativeIncomePct: 70,
        representativeAssetManwon: 34500,
        representativeCarManwon: 4542,
        assetKind: '총자산'
      },
      ranks: [
        {
          rank: '1~4순위 (유형Ⅰ)',
          incomePct: 70,
          incomePctText: '70% 이하 (맞벌이 90% 이하; 1인 +20%p, 2인 +10%p)',
          singleAdj: '+20%p',
          twoAdj: '+10%p',
          assetManwon: 34500,
          assetNote: '출산 37,900만 / 41,300만',
          carManwon: 4542,
          carNote: '출산 4,996만 / 5,451만'
        }
      ],
      notes: '유형Ⅰ은 소득 70%(맞벌이 90%) 이하 기준이며, 1인 +20%p, 2인 +10%p가 가산됩니다.'
    },

    purchased_newlywed_2: {
      key: 'purchased_newlywed_2',
      label: '신혼·신생아 매입임대Ⅱ(전세형)',
      incomeBase: 'urban_worker',
      incomeBaseLabel: '도시근로자 월평균소득',
      pages: 'p.208, p.426',
      summary: {
        incomeText: '1~5순위 130% 이하 (맞벌이 200% 이하, 1인 +20%p·2인 +10%p)',
        assetText: '총자산 36,200만원 이하 (부록 표3 1~5순위 34,500만원 별도 표기)',
        carText: '자동차 4,542만원 이하 (부록 표3 1~4순위 기준)',
        representativeIncomePct: 130,
        representativeAssetManwon: 36200,
        representativeCarManwon: 4542,
        assetKind: '총자산'
      },
      ranks: [
        {
          rank: '1~4순위 (유형Ⅱ)',
          incomePct: 130,
          incomePctText: '130% 이하 (맞벌이 200% 이하; 1인 +20%p, 2인 +10%p)',
          singleAdj: '+20%p',
          twoAdj: '+10%p',
          assetManwon: 36200,
          assetNote: '본문 36,200만 (출산 39,600만/43,100만) · 부록 표3 34,500만',
          carManwon: 4542,
          carNote: '부록 표3 1~4순위 4,542만원'
        },
        {
          rank: '5순위 (유형Ⅱ)',
          incomePct: 130,
          incomePctText: '130% 이하 (맞벌이 200% 이하; 1인 +20%p, 2인 +10%p)',
          singleAdj: '+20%p',
          twoAdj: '+10%p',
          assetManwon: 36200,
          assetNote: '본문 36,200만 · 부록 표3 34,500만',
          carManwon: null,
          carNote: '공고문 확인 필요'
        }
      ],
      notes: '매뉴얼 본문(p.208) 총자산 36,200만원과 부록 <표3>(p.426) 34,500만원이 병기되어 있으므로 공고문 원문을 확인하세요.'
    },

    purchased_multichild: {
      key: 'purchased_multichild',
      label: '다자녀 매입임대',
      incomeBase: 'urban_worker',
      incomeBaseLabel: '도시근로자 월평균소득',
      pages: 'p.217~218, p.426',
      summary: {
        incomeText: '1·2순위 수급 등 / 3순위 70% 이하',
        assetText: '총자산 34,500만원 이하',
        carText: '자동차 4,542만원 이하',
        representativeIncomePct: 70,
        representativeAssetManwon: 34500,
        representativeCarManwon: 4542,
        assetKind: '총자산'
      },
      ranks: [
        {
          rank: '1·2순위 (수급자·차상위·한부모)',
          incomePct: null,
          incomePctText: '수급자·차상위·한부모 자격확인 (1순위는 2년 이내 신생아 포함)',
          singleAdj: '-',
          twoAdj: '-',
          assetManwon: 34500,
          assetNote: '출산 37,900만 / 41,300만',
          carManwon: 4542,
          carNote: '출산 4,996만 / 5,451만'
        },
        {
          rank: '3순위',
          incomePct: 70,
          incomePctText: '70% 이하',
          singleAdj: '-',
          twoAdj: '-',
          assetManwon: 34500,
          assetNote: '출산 37,900만 / 41,300만',
          carManwon: 4542,
          carNote: '출산 4,996만 / 5,451만'
        }
      ],
      notes: '미성년 자녀 2명 이상 무주택 세대구성원 등 다자녀 요건은 공고문에서 추가 확인이 필요합니다.'
    },

    purchased_senior: {
      key: 'purchased_senior',
      label: '고령자 매입임대',
      incomeBase: 'urban_worker',
      incomeBaseLabel: '도시근로자 월평균소득',
      pages: 'p.229~231, p.426',
      summary: {
        incomeText: '1순위 70%(장애인 등) / 2순위 일반 50%·장애인 100% 이하',
        assetText: '총자산 24,500만원 이하',
        carText: '자동차 4,542만원 이하',
        representativeIncomePct: 70,
        representativeAssetManwon: 24500,
        representativeCarManwon: 4542,
        assetKind: '총자산'
      },
      ranks: [
        {
          rank: '1순위 (수급자·한부모·시급·저소득 고령자 / 장애인)',
          incomePct: 70,
          incomePctText: '수급 등 별도 / 장애인 70% 이하 (1인 90%, 2인 80%)',
          singleAdj: '+20%p (90%)',
          twoAdj: '+10%p (80%)',
          assetManwon: 24500,
          assetNote: '출산 27,000만 / 29,400만',
          carManwon: 4542,
          carNote: '출산 4,996만 / 5,451만'
        },
        {
          rank: '2순위 (일반)',
          incomePct: 50,
          incomePctText: '50% 이하 (1인 70%, 2인 60%)',
          singleAdj: '+20%p (70%)',
          twoAdj: '+10%p (60%)',
          assetManwon: 24500,
          assetNote: '출산 27,000만 / 29,400만',
          carManwon: 4542,
          carNote: '출산 4,996만 / 5,451만'
        },
        {
          rank: '2순위 (장애인)',
          incomePct: 100,
          incomePctText: '100% 이하 (1인 120%, 2인 110%)',
          singleAdj: '+20%p (120%)',
          twoAdj: '+10%p (110%)',
          assetManwon: 24500,
          assetNote: '출산 27,000만 / 29,400만',
          carManwon: 4542,
          carNote: '출산 4,996만 / 5,451만'
        }
      ],
      notes: '고령자 매입임대는 일반 매입임대와 동일한 영구·매입 계열 자산(24,500만원) 및 소득 기준을 따릅니다.'
    },

    public_sale: {
      key: 'public_sale',
      label: '공공분양',
      incomeBase: 'urban_worker',
      incomeBaseLabel: '도시근로자 월평균소득',
      pages: 'p.245~255, p.424~435',
      summary: {
        incomeText: '일반 100%(맞벌이 140%·추첨 200%) / 특공 100~140%(맞벌이 120~200%)',
        assetText: '일반형 부동산 21,550만원 / 나눔형 총자산 36,200만원(청년 27,600만) 이하',
        carText: '일반형 자동차 4,542만원 이하 / 나눔형 자동차 기준 없음',
        representativeIncomePct: 100,
        representativeAssetManwon: 21550,
        representativeCarManwon: 4542,
        assetKind: '부동산(일반형)'
      },
      ranks: [
        {
          rank: '일반형 · 일반공급 (전용 60㎡ 이하)',
          incomePct: 100,
          incomePctText: '100% 이하 (맞벌이 140%, 추첨 200%)',
          singleAdj: '-',
          twoAdj: '-',
          assetManwon: 21550,
          assetNote: '부동산 21,550만원 (출산 23,705만/25,860만)',
          carManwon: 4542,
          carNote: '출산 4,996만 / 5,451만'
        },
        {
          rank: '일반형 · 신혼/생애최초 특공',
          incomePct: 130,
          incomePctText: '100~130% 이하 (맞벌이 120~200%)',
          singleAdj: '-',
          twoAdj: '-',
          assetManwon: 21550,
          assetNote: '부동산 21,550만원',
          carManwon: 4542,
          carNote: '자동차 4,542만원 이하'
        },
        {
          rank: '일반형 · 신생아 특공',
          incomePct: 140,
          incomePctText: '100~140% 이하 (맞벌이 120~200%)',
          singleAdj: '-',
          twoAdj: '-',
          assetManwon: 21550,
          assetNote: '부동산 21,550만원',
          carManwon: 4542,
          carNote: '자동차 4,542만원 이하'
        },
        {
          rank: '일반형 · 다자녀/노부모 특공',
          incomePct: 120,
          incomePctText: '120% 이하 (맞벌이 130%/200%)',
          singleAdj: '-',
          twoAdj: '-',
          assetManwon: 21550,
          assetNote: '부동산 21,550만원',
          carManwon: 4542,
          carNote: '자동차 4,542만원 이하'
        },
        {
          rank: '나눔형 · 청년 특공 / 일반',
          incomePct: 140,
          incomePctText: '청년 특공 1인 140% (5,338,708원) / 그 외 유형별 기준',
          singleAdj: '-',
          twoAdj: '-',
          assetManwon: 36200,
          assetNote: '청년 본인 27,600만·부모 103,500만 / 그 외 36,200만 (표3 34,500만)',
          carManwon: null,
          carNote: '나눔형 자동차 기준 없음'
        }
      ],
      notes: '공공분양은 일반형(부동산+자동차)과 나눔형(총자산·자동차 기준 없음)의 자산 기준이 다르므로 공고문의 공급유형을 꼭 확인하세요.'
    },

    newlywed_hope: {
      key: 'newlywed_hope',
      label: '신혼희망타운(분양형)',
      incomeBase: 'urban_worker',
      incomeBaseLabel: '도시근로자 월평균소득',
      pages: 'p.328~329, p.426, p.437',
      summary: {
        incomeText: '우선·일반 130%(맞벌이 140%) / 추첨 130%(맞벌이 200%) 이하',
        assetText: '총자산 36,200만원 이하 (부록 표3 34,500만원)',
        carText: '자동차 기준 없음',
        representativeIncomePct: 130,
        representativeAssetManwon: 36200,
        representativeCarManwon: null,
        assetKind: '총자산'
      },
      ranks: [
        {
          rank: '우선·일반공급',
          incomePct: 130,
          incomePctText: '130% 이하 (맞벌이 140% 이하)',
          singleAdj: '-',
          twoAdj: '-',
          assetManwon: 36200,
          assetNote: '본문 36,200만원 (부록 표3 34,500만원)',
          carManwon: null,
          carNote: '자동차 기준 없음'
        },
        {
          rank: '추첨제',
          incomePct: 130,
          incomePctText: '130% 이하 (맞벌이 200% 이하)',
          singleAdj: '-',
          twoAdj: '-',
          assetManwon: 36200,
          assetNote: '본문 36,200만원 (부록 표3 34,500만원)',
          carManwon: null,
          carNote: '자동차 기준 없음'
        }
      ],
      notes: '분양형 신혼희망타운은 자동차 별도 가액 기준 없이 총자산 한도를 적용합니다.'
    },

    public_rental_conversion: {
      key: 'public_rental_conversion',
      label: '분양전환 공공임대',
      incomeBase: 'urban_worker',
      incomeBaseLabel: '도시근로자 월평균소득',
      pages: 'p.339~342, p.426',
      summary: {
        incomeText: '5·10년 일반(60㎡↓) 100% 이하 (1인 120%·2인 110%·맞벌이 140%/200%)',
        assetText: '5·10년 부동산 21,550만원 / 6년 선택형 총자산 36,200만원 이하',
        carText: '5·10년 자동차 4,542만원 이하 / 6년 선택형 기준 없음',
        representativeIncomePct: 100,
        representativeAssetManwon: 21550,
        representativeCarManwon: 4542,
        assetKind: '부동산/총자산'
      },
      ranks: [
        {
          rank: '5·10년 일반 (전용 60㎡ 이하)',
          incomePct: 100,
          incomePctText: '100% 이하 (1인 120%, 2인 110%, 맞벌이 140%/200%)',
          singleAdj: '+20%p (120%)',
          twoAdj: '+10%p (110%)',
          assetManwon: 21550,
          assetNote: '부동산 21,550만원 이하',
          carManwon: 4542,
          carNote: '자동차 4,542만원 이하'
        },
        {
          rank: '6년 선택형',
          incomePct: null,
          incomePctText: '공고별·청년 기준 확인',
          singleAdj: '-',
          twoAdj: '-',
          assetManwon: 36200,
          assetNote: '총자산 36,200만원 이하 (청년 본인 27,600만·부모 103,500만)',
          carManwon: null,
          carNote: '자동차 기준 없음'
        }
      ],
      notes: '5·10년 분양전환형과 6년 선택형의 자산 기준(부동산 vs 총자산)이 다르므로 공고문 확인이 필요합니다.'
    }
  };

  return {
    version: '2026.07',
    sourceTitle: '공공주택 업무매뉴얼 (2026.07, 신입직원 양성과정)',
    tables: {
      urbanWorkerIncome: URBAN_WORKER_INCOME,
      medianIncome: MEDIAN_INCOME
    },
    types: TYPES
  };
});

/* Matching engine for kkeobi custom notice qualification diagnosis.
 * Pure functions, zero browser storage, zero network calls.
 * Follows 기획서 §4 rules strictly: never classify ambiguous notices as eligible. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('./data/rules_1130.js'),
      require('./data/manual_defaults_202607.js')
    );
  } else {
    root.NoticeMatcher = factory(
      root.NOTICE_RULES || {},
      root.MANUAL_DEFAULTS_202607 || null
    );
  }
})(typeof globalThis !== 'undefined' ? globalThis : window, function (DEFAULT_RULES, MANUAL_DEFAULTS) {
  'use strict';

  var GYEONGGI_CITIES = {
    '수원시': true, '용인시': true, '화성시': true, '성남시': true, '고양시': true,
    '안산시': true, '안양시': true, '남양주시': true, '부천시': true, '평택시': true,
    '시흥시': true, '파주시': true, '의정부시': true, '김포시': true, '광주시': true,
    '광명시': true, '군포시': true, '하남시': true, '오산시': true, '이천시': true,
    '안성시': true, '구리시': true, '양주시': true, '포천시': true, '의왕시': true,
    '여주시': true, '양평군': true, '동두천시': true, '과천시': true, '가평군': true,
    '연천군': true
  };

  var GYEONGGI_NORTH_CITIES = {
    '고양시': true, '구리시': true, '남양주시': true, '동두천시': true, '양주시': true,
    '의정부시': true, '파주시': true, '포천시': true, '가평군': true, '연천군': true
  };

  var REGION_TO_SIDO = {
    '서울': '서울', '서울특별시': '서울', '경기도': '경기',
    '인천광역시': '인천', '인천광역시 외': '인천', '부산광역시': '부산',
    '대구광역시': '대구', '대구광역시 외': '대구', '대전광역시': '대전',
    '대전광역시 외': '대전', '울산광역시': '울산', '세종특별자치시': '세종',
    '강원특별자치도': '강원', '충청북도': '충북', '충청남도': '충남',
    '전북특별자치도': '전북', '전남광주통합특별시': '광주·전남',
    '경상북도': '경북', '경상남도': '경남', '제주특별자치도': '제주', '전국': '전국'
  };

  var SALE_TYPES = { '분양주택': true, '공공분양(신혼희망)': true };
  var NON_HOUSING_KEYWORDS = ['가정어린이집', '운영예정자', '희망돌보미', '사무지원', '유효기간 연장 안내'];

  var SIGUNGU_PATTERNS = [
    ['수원시', ['수원시', '수원당수', '수원 광교', '호매실', '고등2단지', '수원·용인']],
    ['용인시', ['용인시', '수원·용인', '용인']],
    ['화성시', ['화성시', '화성봉담']],
    ['성남시', ['성남시', '성남금토', '위례']],
    ['이천시', ['이천시', '이천갈산']],
    ['파주시', ['파주시', '파주운정']],
    ['안산시', ['안산시', '초지역']],
    ['안성시', ['안성시', '안성공도', '안성 동인', '안성청사']],
    ['평택시', ['평택시', '평택송화']],
    ['시흥시', ['시흥시', '시흥 거모', '시흥거모']],
    ['의정부시', ['의정부시', '의정부우정', '의정부역']],
    ['남양주시', ['남양주시', '다산메트로', '다산진건', '다산센트럴', '다산 포레스트', '다산지금']],
    ['연천군', ['연천군', '연천BIX']],
    ['광주시', ['광주시', '광주역세권', '광주송정']],
    ['안양시', ['안양시', '안양 평촌', '안양냉천']],
    ['부천시', ['부천시', '부천아이파크']],
    ['김포시', ['김포시', '김포한강']],
    ['경기북부', ['경기북부']],
    ['서초구', ['서초구']],
    ['마포구', ['마포구']],
    ['금천구', ['금천구']],
    ['동작구', ['동작구']],
    ['구로구', ['구로구']],
    ['강남구', ['강남구', '수서1', '수서2', 'LH수서']],
    ['송파구', ['송파구', '삼전']],
    ['강동구', ['강동구', '강동천호']],
    ['수영구', ['수영구']],
    ['달서구', ['달서구']],
    ['달성군', ['달성군']],
    ['유성구', ['유성구']],
    ['대덕구', ['대덕구']],
    ['남동구', ['남동구', '인천논현']]
  ];

  var SIDO_TITLE_HINTS = [
    ['서울지역본부', '서울'], ['서울특별시', '서울'], ['서울', '서울'],
    ['부산', '부산'], ['인천', '인천'], ['대구', '대구'], ['대전', '대전'],
    ['울산', '울산'], ['세종', '세종'], ['경기', '경기'], ['강원', '강원'],
    ['충북', '충북'], ['충남', '충남'], ['전북', '전북'],
    ['전남', '광주·전남'], ['광주', '광주·전남'], ['경북', '경북'], ['경남', '경남'], ['제주', '제주']
  ];

  function formatWon(won) {
    if (won === null || won === undefined || isNaN(won)) return '-';
    return Math.round(won).toLocaleString('ko-KR') + '원';
  }

  function formatManwon(won) {
    if (won === null || won === undefined || isNaN(won)) return '-';
    var m = won / 10000;
    if (m >= 10000) {
      var uk = Math.floor(m / 10000);
      var rem = Math.round(m % 10000);
      return rem > 0 ? uk + '억 ' + rem.toLocaleString('ko-KR') + '만원' : uk + '억원';
    }
    return Math.round(m).toLocaleString('ko-KR') + '만원';
  }

  function daysBetween(fromStr, toStr) {
    if (!fromStr || !toStr) return null;
    var a = new Date(fromStr + 'T00:00:00Z');
    var b = new Date(toStr + 'T00:00:00Z');
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
    return Math.round((b.getTime() - a.getTime()) / 86400000);
  }

  function lookupIncomeLimit(tableSpec, householdSize) {
    if (!tableSpec || !tableSpec.limits) return null;
    var size = Math.max(1, Number(householdSize) || 1);
    if (tableSpec.limits[size] !== undefined) {
      return tableSpec.limits[size];
    }
    if (size > 6 && tableSpec.limits[6] !== undefined) {
      if (tableSpec.extra_per_person === null || tableSpec.extra_per_person === undefined) {
        return null;
      }
      return tableSpec.limits[6] + (size - 6) * tableSpec.extra_per_person;
    }
    return null;
  }

  function lookupPctLimit(pctTable, pct, householdSize) {
    var entry = pctTable[pct];
    if (!entry) return null;
    var size = Math.max(1, Number(householdSize) || 1);
    if (entry[size] !== undefined) return entry[size];
    if (size > 6 && entry[6] !== undefined) {
      return entry.extra ? entry[6] + (size - 6) * entry.extra : null;
    }
    return null;
  }

  function normalizeSido(region) {
    if (REGION_TO_SIDO[region]) return REGION_TO_SIDO[region];
    if (GYEONGGI_CITIES[region]) return '경기';
    return region || '미상';
  }

  function enrichRawRow(row, supersededByMap) {
    var t = (row.type || '').trim();
    var title = row.title || '';
    var category = '임대';
    if (t === '가정어린이집' || NON_HOUSING_KEYWORDS.some(function (kw) { return title.indexOf(kw) >= 0; })) {
      category = '비주거';
    } else if (SALE_TYPES[t]) {
      category = '분양';
    }

    var baseSido = normalizeSido((row.region || '').trim());
    var titleSidos = [];
    for (var i = 0; i < SIDO_TITLE_HINTS.length; i++) {
      var tok = SIDO_TITLE_HINTS[i][0];
      var sd = SIDO_TITLE_HINTS[i][1];
      if (title.indexOf(tok) >= 0) {
        if (tok === '광주' && baseSido === '경기') continue;
        if (titleSidos.indexOf(sd) < 0) titleSidos.push(sd);
      }
    }
    var effectiveSidos = baseSido === '전국' && titleSidos.length > 0 ? titleSidos : [baseSido];
    if (baseSido !== '전국') {
      for (var j = 0; j < titleSidos.length; j++) {
        var extra = titleSidos[j];
        if (effectiveSidos.indexOf(extra) < 0 && (title.indexOf('·' + extra) >= 0 || title.indexOf(extra + '·') >= 0)) {
          effectiveSidos.push(extra);
        }
      }
    }

    var sigungu = [];
    if (GYEONGGI_CITIES[(row.region || '').trim()]) sigungu.push((row.region || '').trim());
    for (var p = 0; p < SIGUNGU_PATTERNS.length; p++) {
      var sg = SIGUNGU_PATTERNS[p][0];
      var pats = SIGUNGU_PATTERNS[p][1];
      if (sg === '광주시' && baseSido === '광주·전남') continue;
      if (pats.some(function (pt) { return title.indexOf(pt) >= 0; })) {
        if (sigungu.indexOf(sg) < 0) sigungu.push(sg);
      }
    }

    var targetHints = [];
    var targetChecks = [
      ['청년', ['청년', '사회초년생']],
      ['신혼·신생아', ['신혼', '신생아', '신혼희망']],
      ['고령자', ['고령자', '홀몸어르신', '어르신']],
      ['철거민', ['철거민']],
      ['기숙사', ['기업체 기숙사', '공공기숙사']],
      ['창업지원', ['창업지원', '창업특화']],
      ['대학생·청년', ['희망하우징']],
      ['무주택완화', ['무주택 요건 완화', '유주택자 가능']]
    ];
    for (var c = 0; c < targetChecks.length; c++) {
      var label = targetChecks[c][0];
      var kws = targetChecks[c][1];
      if (kws.some(function (k) { return title.indexOf(k) >= 0; })) targetHints.push(label);
    }

    var copy = {};
    Object.keys(row).forEach(function (k) { copy[k] = row[k]; });
    copy._meta = {
      category: category,
      sido: baseSido,
      effective_sidos: effectiveSidos,
      sigungu_hints: sigungu,
      gyeonggi_north_only: sigungu.indexOf('경기북부') >= 0,
      target_hints: targetHints,
      superseded_by: supersededByMap[row.key] || null,
      has_verified_rules: row.key === 'LH-2015122300021130',
      wp_post_url: row.key === 'LH-2015122300021130' ? 'https://kkeobi.goppama.com/suwon-homaesil21-godeung2-happy-202611/' : null,
      has_saved_pdf: (row.attachments || '').toLowerCase().indexOf('.pdf') >= 0 && (row.attachments || '').indexOf('(미저장)') < 0
    };
    return copy;
  }

  function parseCsvText(csvText) {
    var clean = (csvText || '').replace(/^\uFEFF/, '');
    var rows = [];
    var row = [];
    var field = '';
    var inQuotes = false;
    for (var i = 0; i < clean.length; i++) {
      var ch = clean[i];
      if (inQuotes) {
        if (ch === '"') {
          if (clean[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field);
        field = '';
      } else if (ch === '\r') {
        continue;
      } else if (ch === '\n') {
        row.push(field);
        if (row.length > 1 || row[0] !== '') rows.push(row);
        row = [];
        field = '';
      } else {
        field += ch;
      }
    }
    if (field !== '' || row.length > 0) {
      row.push(field);
      rows.push(row);
    }
    if (rows.length < 2) return [];
    var headers = rows[0].map(function (h) { return h.trim(); });
    var rawObjs = [];
    for (var r = 1; r < rows.length; r++) {
      var obj = {};
      for (var c = 0; c < headers.length; c++) {
        obj[headers[c]] = rows[r][c] !== undefined ? rows[r][c] : '';
      }
      rawObjs.push(obj);
    }
    // Build superseded lookup safely
    var byKey = {};
    var latestByNorm = {};
    var supersededByMap = {};
    rawObjs.forEach(function (it) { byKey[it.key] = it; });
    rawObjs.forEach(function (it) {
      if (it.correction_of && byKey[it.correction_of]) {
        var orig = byKey[it.correction_of];
        if ((it.posted_date || '') >= (orig.posted_date || '') && (orig.status === '정정공고중' || it.status !== '접수마감')) {
          supersededByMap[it.correction_of] = it.key;
        }
      }
      var norm = (it.title || '').trim().replace(/^(?:\[정정공고\]\s*)+/, '');
      var pairKey = (it.org || '') + '||' + norm;
      var curScore = (it.posted_date || '') + '|' + (it.title.indexOf('[정정공고]') >= 0 ? '1' : '0') + '|' + (it.status !== '정정공고중' ? '1' : '0') + '|' + (it.key || '');
      if (!latestByNorm[pairKey] || curScore > latestByNorm[pairKey].score) {
        latestByNorm[pairKey] = { score: curScore, row: it };
      }
    });
    rawObjs.forEach(function (it) {
      if (!supersededByMap[it.key] && it.status === '정정공고중') {
        var norm = (it.title || '').trim().replace(/^(?:\[정정공고\]\s*)+/, '');
        var pairKey = (it.org || '') + '||' + norm;
        var latest = latestByNorm[pairKey] && latestByNorm[pairKey].row;
        if (latest && latest.key !== it.key && (latest.posted_date || '') >= (it.posted_date || '')) {
          supersededByMap[it.key] = latest.key;
        }
      }
    });
    return rawObjs.map(function (it) { return enrichRawRow(it, supersededByMap); });
  }

  function checkRegionAndPeriod(user, notice, rule, refDate) {
    var meta = notice._meta || {};
    var applyEnd = notice.apply_end || (rule && rule.apply_end_pdf) || '';
    var dday = applyEnd ? daysBetween(refDate, applyEnd) : null;

    if (meta.category === '비주거') {
      return { status: 'fail', reason: '주거 모집 공고가 아닙니다 (' + (notice.type || '안내/채용') + ')', dday: dday, applyEnd: applyEnd };
    }
    if (meta.superseded_by) {
      return { status: 'fail', reason: '정정공고(' + meta.superseded_by + ')로 대체된 이전 공고입니다', dday: dday, applyEnd: applyEnd };
    }
    if (notice.status === '접수마감' || (dday !== null && dday < 0)) {
      return { status: 'fail', reason: '접수 마감된 공고입니다' + (applyEnd ? ' (' + applyEnd + ' 마감)' : ''), dday: dday, applyEnd: applyEnd };
    }

    var hopeType = user.hopeType || 'all';
    if (hopeType === 'rental' && meta.category === '분양') {
      return { status: 'fail', reason: '분양 공고입니다 (희망 유형: 공공임대)', dday: dday, applyEnd: applyEnd };
    }
    if (hopeType === 'sale' && meta.category !== '분양') {
      return { status: 'fail', reason: '임대 공고입니다 (희망 유형: 공공분양)', dday: dday, applyEnd: applyEnd };
    }

    var hopeSido = user.hopeSido || '전국';
    var hopeSigungu = user.hopeSigungu || '';
    var effSidos = meta.effective_sidos && meta.effective_sidos.length ? meta.effective_sidos : [meta.sido || '전국'];
    var sgHints = meta.sigungu_hints || [];

    if (hopeSido !== '전국' && effSidos.indexOf('전국') < 0 && effSidos.indexOf(hopeSido) < 0) {
      return { status: 'fail', reason: '희망 지역(' + hopeSido + ')과 다릅니다 (' + (notice.region || effSidos.join('·')) + ')', dday: dday, applyEnd: applyEnd };
    }

    if (hopeSido !== '전국' && hopeSigungu) {
      if (meta.gyeonggi_north_only && !GYEONGGI_NORTH_CITIES[hopeSigungu]) {
        return { status: 'fail', reason: '경기북부 대상 공고입니다 (희망: ' + hopeSigungu + ')', dday: dday, applyEnd: applyEnd };
      }
      if (sgHints.length > 0 && sgHints.indexOf('경기북부') < 0 && sgHints.indexOf(hopeSigungu) < 0) {
        return { status: 'fail', reason: '희망 시·군·구(' + hopeSigungu + ')와 다릅니다 (' + sgHints.join('·') + ')', dday: dday, applyEnd: applyEnd };
      }
    }

    var regionDetailOk = hopeSido === '전국' || !hopeSigungu || sgHints.indexOf(hopeSigungu) >= 0;
    if (!applyEnd) {
      return {
        status: 'check',
        reason: (regionDetailOk ? '지역 조건 통과' : '세부 시·군·구 확인 필요') + ', 접수 마감일이 목록에 비어 있어 공고문 확인이 필요합니다',
        dday: null,
        applyEnd: ''
      };
    }
    if (!regionDetailOk) {
      return {
        status: 'check',
        reason: '시·도(' + effSidos.join('·') + ')는 맞으나 세부 시·군·구(' + hopeSigungu + ' 포함 여부) 확인 필요 · 마감 ' + applyEnd,
        dday: dday,
        applyEnd: applyEnd
      };
    }

    return {
      status: 'pass',
      reason: (hopeSigungu || hopeSido) + ' 지역 일치 · ' + applyEnd + ' 마감' + (dday === 0 ? ' (오늘 마감)' : ' (D-' + dday + ')'),
      dday: dday,
      applyEnd: applyEnd
    };
  }

  function evaluate1130Target(user) {
    var ageBand = user.ageBand;
    var marital = user.marital;
    var birthChildren = Math.min(2, Number(user.birthChildrenAfter230328) || 0);

    if (marital === 'single') {
      if (ageBand === '65plus') {
        return { status: 'fail', group: null, periodRank: null, reason: '만 65세 이상(고령자 계층)은 이번 공고에서 모집하지 않습니다' };
      }
      if (ageBand === '19_39') {
        return {
          status: 'pass',
          group: 'youth',
          periodRank: 1,
          youthSubtype: user.youthHasIncome === 'none' ? 'youth_no_income' : 'youth_with_income',
          reason: '청년 계층(만 19~39세 미혼) 일반조건 1순위 충족'
        };
      }
      // under19 or 40_64 single -> must qualify via 사회초년생 (income/retired/artist + work years)
      if (user.youthHasIncome === 'none' || !user.youthHasIncome) {
        return {
          status: 'fail',
          group: null,
          periodRank: null,
          reason: '청년 나이(19~39세) 및 사회초년생 요건(소득·구직급여·예술인)에 해당하지 않습니다'
        };
      }
      if (user.youthWorkYears === '0' || user.youthWorkYears === 'le5') {
        return {
          status: 'pass',
          group: 'youth',
          periodRank: 1,
          youthSubtype: 'youth_with_income',
          reason: '사회초년생 계층 일반조건 1순위 충족 (소득업무 종사기간 5년 이내)'
        };
      }
      if (user.youthWorkYears === '5to7') {
        return {
          status: 'pass',
          group: 'youth',
          periodRank: 2,
          youthSubtype: 'youth_with_income',
          reason: '사회초년생 완화조건 2순위 충족 (소득업무 종사기간 5년 초과~7년 이내)'
        };
      }
      if (user.youthWorkYears === 'over7') {
        return {
          status: 'fail',
          group: null,
          periodRank: null,
          reason: '사회초년생 소득 있는 업무 종사기간 완화 한도(7년 이내)를 초과했습니다'
        };
      }
      return {
        status: 'check',
        group: 'youth',
        periodRank: 2,
        youthSubtype: 'youth_with_income',
        reason: '사회초년생 소득 있는 업무 종사기간(5년·7년 이내) 확인이 필요합니다'
      };
    }

    if (marital === 'engaged') {
      return {
        status: 'pass',
        group: 'newlywed',
        periodRank: 1,
        reason: '예비신혼부부 계층 1순위 충족 (입주 전 혼인사실 증명 조건)'
      };
    }

    if (marital === 'newlywed') {
      return {
        status: 'pass',
        group: 'newlywed',
        periodRank: 1,
        reason: '신혼부부 계층 일반조건 1순위 충족 (혼인 7년 이내 또는 6세 이하 자녀)'
      };
    }

    if (marital === 'married_over7') {
      if (birthChildren >= 1) {
        return {
          status: 'pass',
          group: 'newlywed',
          periodRank: 1,
          reason: '신혼부부 계층 1순위 충족 (\'23.3.28 이후 출산 자녀가 있어 6세 이하 자녀 요건 해당)'
        };
      }
      if (user.marriedPeriodStatus === '7to10') {
        return {
          status: 'pass',
          group: 'newlywed',
          periodRank: 2,
          reason: '신혼부부 완화조건 2순위 충족 (혼인 7~10년 이내 또는 7~9세 자녀)'
        };
      }
      if (user.marriedPeriodStatus === 'over10') {
        return {
          status: 'fail',
          group: null,
          periodRank: null,
          reason: '혼인 10년 초과 및 만 9세 이하 자녀 없음으로 신혼부부 완화 요건에 해당하지 않습니다'
        };
      }
      return {
        status: 'check',
        group: 'newlywed',
        periodRank: 2,
        reason: '혼인기간(10년 이내) 또는 만 9세 이하 자녀 해당 여부 확인이 필요합니다'
      };
    }

    if (marital === 'single_parent') {
      if (birthChildren >= 1 || user.singleParentChildAge === 'le6') {
        return {
          status: 'pass',
          group: 'newlywed',
          periodRank: 1,
          reason: '한부모가족 계층 일반조건 1순위 충족 (만 6세 이하 자녀)'
        };
      }
      if (user.singleParentChildAge === '7to9') {
        return {
          status: 'pass',
          group: 'newlywed',
          periodRank: 2,
          reason: '한부모가족 완화조건 2순위 충족 (만 7~9세 자녀)'
        };
      }
      if (user.singleParentChildAge === 'ge10') {
        return {
          status: 'fail',
          group: null,
          periodRank: null,
          reason: '한부모가족 자녀 연령 완화 요건(만 9세 이하, 태아 포함)을 초과했습니다'
        };
      }
      return {
        status: 'check',
        group: 'newlywed',
        periodRank: 2,
        reason: '한부모가족 막내 자녀 연령(6세/9세 이하) 확인이 필요합니다'
      };
    }

    return { status: 'check', group: null, periodRank: null, reason: '혼인·계층 정보 확인이 필요합니다' };
  }

  function evaluate1130IncomeSingleTable(rule, tableKey, effSize, incomeWon, birthBonus, isYouth, dualLabel) {
    var table = rule.income_tables[tableKey];
    var r1Base = lookupIncomeLimit(table.rank1, effSize);
    var r2Limit = lookupIncomeLimit(table.rank2, effSize);
    var r3Limit = lookupIncomeLimit(table.rank3, effSize);

    var basePctMap = (table.rank1 && table.rank1.pct_by_size) || {};
    var basePct = effSize === 1 ? (basePctMap[1] || 100) : (effSize === 2 ? (basePctMap[2] || 100) : (basePctMap[3] || 100));
    var r1TargetPct = Math.min(140, basePct + birthBonus * 10);
    // Notice PDF p.7 & p.9 cap: 1인+birth0=120%, single/youth 3인+ max=120%, dual 3인 1인=130%, 4인+ 2인+=140%
    if (!dualLabel && r1TargetPct > 120) r1TargetPct = 120;
    var r1Limit = birthBonus > 0 ? lookupPctLimit(rule.income_tables.pct_table, r1TargetPct, effSize) : r1Base;
    if (r1Limit === null && effSize > 6) {
      return { status: 'check', rank: null, reason: '7인 이상 가구의 출산가산(' + r1TargetPct + '%) 기준금액 추가 확인이 필요합니다' };
    }
    if (r3Limit === null) {
      return { status: 'check', rank: null, reason: '가구원수 소득 기준표 확인이 필요합니다' };
    }

    if (r1Limit !== null && incomeWon <= r1Limit) {
      return {
        status: 'pass',
        rank: 1,
        limitUsed: r1Limit,
        reason: effSize + '인 가구 1순위(' + r1TargetPct + '%·' + formatWon(r1Limit) + ' 이하) 충족'
      };
    }
    if (r2Limit !== null && incomeWon <= r2Limit) {
      return {
        status: 'pass',
        rank: 2,
        limitUsed: r2Limit,
        reason: effSize + '인 가구 완화 2순위(' + formatWon(r2Limit) + ' 이하) 충족'
      };
    }
    if (incomeWon <= r3Limit) {
      if (incomeWon > r3Limit * 0.95) {
        return {
          status: 'check',
          rank: 3,
          limitUsed: r3Limit,
          reason: effSize + '인 가구 3순위 상한(' + formatWon(r3Limit) + ', 150%)의 95% 초과 경계 구간 — 공적소득 확인 필요'
        };
      }
      return {
        status: 'pass',
        rank: 3,
        limitUsed: r3Limit,
        reason: effSize + '인 가구 완화 3순위(150%·' + formatWon(r3Limit) + ' 이하) 충족'
      };
    }
    return {
      status: 'fail',
      rank: null,
      limitUsed: r3Limit,
      reason: effSize + '인 가구 3순위 상한(' + formatWon(r3Limit) + ', 150%)을 초과했습니다'
    };
  }

  function evaluate1130Notice(user, notice, rule, refDate) {
    var checks = {};
    var notes = [];

    // 1. Region & Period
    var rp = checkRegionAndPeriod(user, notice, rule, refDate);
    checks.regionPeriod = { label: '지역·접수기간', status: rp.status, reason: rp.reason };

    // 2. Target group
    var tg = evaluate1130Target(user);
    checks.target = { label: '모집 계층', status: tg.status, reason: tg.reason };

    // 3. Homeless
    if (!tg.group) {
      checks.homeless = { label: '무주택', status: tg.status === 'fail' ? 'fail' : 'check', reason: '모집 계층 판정 후 무주택 범위를 적용합니다' };
    } else if (tg.group === 'youth') {
      if (user.housing === 'all_homeless' || user.housing === 'self_only') {
        checks.homeless = { label: '무주택', status: 'pass', reason: '청년 계층은 신청자 본인 무주택 기준 적용 (충족)' };
      } else {
        checks.homeless = { label: '무주택', status: 'fail', reason: '유주택자는 신청할 수 없습니다' };
      }
    } else {
      if (user.housing === 'all_homeless') {
        checks.homeless = { label: '무주택', status: 'pass', reason: '신혼부부·한부모 계층 세대구성원 전원 무주택 충족' };
      } else if (user.housing === 'self_only') {
        checks.homeless = { label: '무주택', status: 'fail', reason: '신혼부부·한부모 계층은 본인뿐 아니라 세대구성원 전원이 무주택이어야 합니다' };
      } else {
        checks.homeless = { label: '무주택', status: 'fail', reason: '유주택자는 신청할 수 없습니다' };
      }
    }

    // 4. Income
    var rawSize = Math.max(1, Number(user.householdSize) || 1);
    var effSize = tg.group === 'newlywed' ? Math.max(2, rawSize) : rawSize;
    var birthBonus = Math.min(2, Number(user.birthChildrenAfter230328) || 0);
    var incomeResult = null;

    if (user.incomeManwon === null || user.incomeManwon === undefined || user.incomeManwon === '') {
      checks.income = { label: '소득', status: 'check', reason: '월 소득을 입력하지 않아 도시근로자 월평균소득 기준 대조가 필요합니다' };
    } else if (!tg.group) {
      checks.income = { label: '소득', status: tg.status === 'fail' ? 'fail' : 'check', reason: '모집 계층이 맞지 않아 소득 대조를 적용할 수 없습니다' };
    } else {
      var incomeWon = Number(user.incomeManwon) * 10000;
      if (tg.group === 'youth') {
        incomeResult = evaluate1130IncomeSingleTable(rule, 'youth', effSize, incomeWon, birthBonus, true, false);
        checks.income = { label: '소득', status: incomeResult.status, reason: incomeResult.reason };
        if (rawSize >= 2) {
          notes.push('세대원이 있는 세대주 청년은 세대기준(' + rawSize + '인), 부모님 등 세대원인 청년은 본인 1인 기준이 적용됩니다.');
        }
      } else if (user.marital === 'single_parent' || user.dualIncome === 'single') {
        incomeResult = evaluate1130IncomeSingleTable(rule, 'newlywed_single', effSize, incomeWon, birthBonus, false, false);
        checks.income = { label: '소득', status: incomeResult.status, reason: incomeResult.reason };
      } else if (user.dualIncome === 'dual') {
        incomeResult = evaluate1130IncomeSingleTable(rule, 'newlywed_dual', effSize, incomeWon, birthBonus, false, true);
        checks.income = { label: '소득', status: incomeResult.status, reason: incomeResult.reason };
      } else {
        // dualIncome unknown -> test both single & dual
        var resSingle = evaluate1130IncomeSingleTable(rule, 'newlywed_single', effSize, incomeWon, birthBonus, false, false);
        var resDual = evaluate1130IncomeSingleTable(rule, 'newlywed_dual', effSize, incomeWon, birthBonus, false, true);
        if (resSingle.status === 'fail' && resDual.status === 'fail') {
          incomeResult = resDual;
          checks.income = { label: '소득', status: 'fail', reason: resDual.reason };
        } else if (resSingle.status === 'pass' && resDual.status === 'pass' && resSingle.rank === resDual.rank) {
          incomeResult = resSingle;
          checks.income = { label: '소득', status: 'pass', reason: resSingle.reason + ' (외벌이·맞벌이 동일 충족)' };
        } else {
          incomeResult = resDual;
          checks.income = {
            label: '소득',
            status: 'check',
            reason: '맞벌이 여부 미선택으로 외벌이(' + resSingle.reason + ')와 맞벌이(' + resDual.reason + ') 결과가 갈립니다'
          };
        }
      }
      if (rawSize === 1 && tg.group === 'newlywed') {
        notes.push('예비신혼부부는 혼인으로 구성될 2인 이상 세대 기준으로 소득을 산정합니다.');
      }
    }

    // 5. Assets & Car
    if (!tg.group) {
      checks.assetCar = { label: '자산·자동차', status: tg.status === 'fail' ? 'fail' : 'check', reason: '모집 계층이 맞지 않아 자산 대조를 적용할 수 없습니다' };
    } else {
      var assetGroup = rule.asset_limits[tg.group][birthBonus];
      var assetLimit = assetGroup.asset_won;
      var carLimit = assetGroup.car_won;
      var assetState = 'pass';
      var assetMsg = '';

      if (user.assetManwon === null || user.assetManwon === undefined || user.assetManwon === '') {
        assetState = 'check';
        assetMsg = '총자산 미입력 (한도 ' + formatManwon(assetLimit) + ')';
      } else {
        var assetWon = Number(user.assetManwon) * 10000;
        if (assetWon > assetLimit) {
          assetState = 'fail';
          assetMsg = '총자산(' + formatManwon(assetWon) + ')이 한도(' + formatManwon(assetLimit) + ')를 초과했습니다';
        } else if (assetWon > assetLimit * 0.97) {
          assetState = 'check';
          assetMsg = '총자산(' + formatManwon(assetWon) + ')이 한도(' + formatManwon(assetLimit) + ')의 97% 초과 경계 구간입니다';
        } else {
          assetMsg = '총자산 ' + formatManwon(assetLimit) + ' 이하 충족';
        }
      }

      var carState = 'pass';
      var carMsg = '';
      var hasCarExemption = (user.vulnerabilities || []).some(function (v) { return v === 'disabled' || v === 'merit'; });

      if (user.carStatus === 'none') {
        carMsg = '자동차 없음 충족';
      } else if (user.carStatus === 'le_4542') {
        if (user.carValueManwon !== null && user.carValueManwon !== undefined && user.carValueManwon !== '') {
          var cvWon = Number(user.carValueManwon) * 10000;
          if (cvWon > carLimit) {
            carState = hasCarExemption ? 'check' : 'fail';
            carMsg = hasCarExemption ? '차량가액 초과이나 장애인·국가유공자 제외 특례 확인 필요' : '자동차 가액(' + formatManwon(cvWon) + ')이 한도(' + formatManwon(carLimit) + ')를 초과했습니다';
          } else {
            carMsg = '자동차 ' + formatManwon(carLimit) + ' 이하 충족';
          }
        } else {
          carMsg = '자동차 4,542만원 이하 충족';
        }
      } else if (user.carStatus === 'over_4542') {
        if (hasCarExemption) {
          carState = 'check';
          carMsg = '자동차 4,542만원 초과(장애인·국가유공자 보철용 차량 제외 대상 여부 확인 필요)';
        } else if (user.carValueManwon !== null && user.carValueManwon !== undefined && user.carValueManwon !== '') {
          var exactCar = Number(user.carValueManwon) * 10000;
          if (exactCar <= carLimit) {
            carState = 'pass';
            carMsg = '출산자녀 가산 자동차 한도(' + formatManwon(carLimit) + ') 이하 충족';
          } else {
            carState = 'fail';
            carMsg = '자동차 가액(' + formatManwon(exactCar) + ')이 한도(' + formatManwon(carLimit) + ')를 초과했습니다';
          }
        } else if (birthBonus > 0) {
          carState = 'check';
          carMsg = '출산자녀 가산 자동차 한도(' + formatManwon(carLimit) + ') 적용 — 정확한 차량가액 확인 필요';
        } else {
          carState = 'fail';
          carMsg = '자동차 가액이 공고 한도(' + formatManwon(carLimit) + ')를 초과했습니다';
        }
      } else {
        carState = 'check';
        carMsg = '자동차 보유·가액 확인 필요 (한도 ' + formatManwon(carLimit) + ')';
      }

      var combinedAssetStatus = 'pass';
      if (assetState === 'fail' || carState === 'fail') combinedAssetStatus = 'fail';
      else if (assetState === 'check' || carState === 'check') combinedAssetStatus = 'check';
      checks.assetCar = { label: '자산·자동차', status: combinedAssetStatus, reason: assetMsg + ' / ' + carMsg };
    }

    // Subscription note
    if (!user.subscription) {
      notes.push('청약통장 미가입 상태입니다 — 신청은 가능하나 입주 전까지 가입사실 증명이 필요합니다.');
    }

    // Region general supply priority note
    if (rp.status !== 'fail' && user.hopeSido === '경기' && user.hopeSigungu === '수원시') {
      notes.push('일반공급 1순위 지역(수원시) 해당. 동일 순위 시 추첨 선정.');
    } else if (rp.status !== 'fail' && (user.hopeSido === '경기' || user.hopeSido === '서울' || user.hopeSido === '인천')) {
      notes.push('수원·연접지역(용인·화성·의왕·안산) 거주·소득근거지가 아니면 일반공급 2·3순위 적용.');
    }

    // Determine matched unit(s)
    var matchedUnits = [];
    if (tg.group === 'youth') {
      var st = tg.youthSubtype || (user.youthHasIncome === 'none' ? 'youth_no_income' : 'youth_with_income');
      matchedUnits = rule.supply_units.filter(function (u) { return u.target_group === st; });
    } else if (tg.group === 'newlywed') {
      matchedUnits = rule.supply_units.filter(function (u) { return u.target_group === 'newlywed'; });
    }

    var allCheckList = [checks.target, checks.homeless, checks.income, checks.assetCar, checks.regionPeriod];
    var failCheck = allCheckList.find(function (c) { return c.status === 'fail'; });
    var checkItems = allCheckList.filter(function (c) { return c.status === 'check'; });

    var overall = 'eligible';
    if (failCheck) overall = 'excluded';
    else if (checkItems.length > 0) overall = 'needs_check';

    var finalRank = null;
    if (tg.periodRank && incomeResult && incomeResult.rank) {
      finalRank = Math.max(tg.periodRank, incomeResult.rank);
    } else if (tg.periodRank) {
      finalRank = tg.periodRank;
    }

    var summaryReason = '';
    if (overall === 'excluded') {
      summaryReason = failCheck.label + ' 미충족: ' + failCheck.reason;
    } else if (overall === 'needs_check') {
      summaryReason = '확인 필요(' + checkItems.map(function (c) { return c.label; }).join('·') + '): ' + checkItems[0].reason;
    } else {
      var rankLabel = finalRank === 1 ? '1순위(일반조건)' : '완화 ' + finalRank + '순위';
      summaryReason = tg.reason.replace(/ 충족$/, '') + ' · ' + rankLabel + ' · ' + rp.reason;
    }

    return {
      notice: notice,
      overall: overall,
      summaryReason: summaryReason,
      checks: checks,
      dday: rp.dday,
      applyEnd: rp.applyEnd,
      wpPostUrl: rule.wp_post_url,
      hasVerifiedRules: true,
      finalRank: finalRank,
      matchedUnits: matchedUnits,
      notes: notes,
      manualRef: null
    };
  }

  function resolveManualTypeKey(notice) {
    var type = String((notice && notice.type) || '');
    var title = String((notice && notice.title) || '');

    if (type.indexOf('어린이집') >= 0 || type.indexOf('채용') >= 0 || type.indexOf('장기전세') >= 0) {
      return null;
    }
    var nonManualTitleKeywords = ['사회주택', '희망하우징', '창업특화', 'GH Care Hub 특화형', '든든전세', '공동체주택', '토지임대부', '전세임대'];
    for (var i = 0; i < nonManualTitleKeywords.length; i++) {
      if (title.indexOf(nonManualTitleKeywords[i]) >= 0) return null;
    }

    if (type === '영구임대') return 'permanent';
    if (type === '국민임대') return 'national';
    if (type === '행복주택' || type === '행복주택(신혼희망)') return 'happy';
    if (type === '통합공공임대') return 'integrated';
    if (type === '공공분양(신혼희망)' || title.indexOf('신혼희망타운') >= 0) return 'newlywed_hope';
    if (type === '분양주택') return 'public_sale';

    if (type === '공공임대') {
      if (title.indexOf('매입') >= 0) {
        return resolvePurchasedSubtype(title, true);
      }
      return 'public_rental_conversion';
    }

    if (type.indexOf('매입임대') >= 0 || type === '주택임대') {
      if (title.indexOf('영구임대') >= 0) return 'permanent';
      if (title.indexOf('국민임대') >= 0) return 'national';
      if (title.indexOf('행복주택') >= 0) return 'happy';
      if (title.indexOf('통합공공임대') >= 0) return 'integrated';
      return resolvePurchasedSubtype(title, type.indexOf('매입임대') >= 0 || title.indexOf('매입') >= 0);
    }

    return null;
  }

  function resolvePurchasedSubtype(title, fallbackGeneral) {
    if (title.indexOf('신혼') >= 0 || title.indexOf('신생아') >= 0) {
      if (
        title.indexOf('Ⅱ') >= 0 ||
        title.indexOf('2형') >= 0 ||
        title.indexOf('유형2') >= 0 ||
        title.indexOf('유형Ⅱ') >= 0 ||
        title.indexOf('전세형') >= 0
      ) {
        return 'purchased_newlywed_2';
      }
      return 'purchased_newlywed_1';
    }
    if (title.indexOf('다자녀') >= 0) return 'purchased_multichild';
    if (title.indexOf('청년') >= 0) return 'purchased_youth';
    if (title.indexOf('고령자') >= 0 || title.indexOf('어르신') >= 0) return 'purchased_senior';
    return fallbackGeneral ? 'purchased_general' : null;
  }

  function buildManualReference(user, notice, defaults) {
    if (!defaults || !defaults.types) return null;
    var typeKey = resolveManualTypeKey(notice);
    if (!typeKey || !defaults.types[typeKey]) return null;

    var spec = defaults.types[typeKey];
    var sum = spec.summary;
    var message =
      '이 유형(' + spec.label + ')은 보통 ' + spec.incomeBaseLabel + ' ' + sum.incomeText + ', ' +
      sum.assetText + ', ' + sum.carText + ' 기준인데, 이 공고의 정확한 기준은 공고문을 확인해 주세요.';

    // Build non-binding comparison hints against representative manual figures
    var hhRaw = Number((user && user.householdSize) || 1);
    var tableKey = spec.incomeBase === 'median_income' ? 'medianIncome' : 'urbanWorkerIncome';
    var maxHh = spec.incomeBase === 'median_income' ? 6 : 8;
    var hhIdx = Math.max(1, Math.min(maxHh, hhRaw)) - 1;
    var table = (defaults.tables && defaults.tables[tableKey]) || {};

    var householdAdjKeys = {
      permanent: true,
      national: true,
      happy: true,
      integrated: true,
      purchased_general: true,
      purchased_youth: true,
      purchased_newlywed_1: true,
      purchased_newlywed_2: true,
      purchased_senior: true,
      public_rental_conversion: true
    };

    var repPct = sum.representativeIncomePct;
    var usedPct = repPct;
    var limitWon = null;
    if (repPct) {
      var adjPct = repPct + (householdAdjKeys[typeKey] ? (hhRaw === 1 ? 20 : (hhRaw === 2 ? 10 : 0)) : 0);
      if (table[adjPct] && table[adjPct][hhIdx]) {
        usedPct = adjPct;
        limitWon = table[adjPct][hhIdx];
      } else if (table[repPct] && table[repPct][hhIdx]) {
        usedPct = repPct;
        limitWon = table[repPct][hhIdx];
      }
    }

    var cmpItems = [];
    var incomeNote = '';
    if (user && user.incomeManwon !== null && user.incomeManwon !== undefined && limitWon) {
      var userWon = Number(user.incomeManwon) * 10000;
      if (userWon <= limitWon) {
        incomeNote = usedPct + '%(' + formatWon(limitWon) + ') 이하 참고 범위';
        cmpItems.push({ status: 'ok', text: '소득 참고: ' + usedPct + '%(' + formatWon(limitWon) + ') 이하' });
      } else {
        incomeNote = '대표기준 ' + usedPct + '%(' + formatWon(limitWon) + ') 초과 가능';
        cmpItems.push({ status: 'warn', text: '소득 참고: ' + usedPct + '%(' + formatWon(limitWon) + ') 초과' });
      }
    } else if (limitWon) {
      incomeNote = hhRaw + '인 ' + usedPct + '% 기준 ' + formatWon(limitWon);
      cmpItems.push({ status: 'neutral', text: '소득 참고(' + hhRaw + '인 ' + usedPct + '%): ' + formatWon(limitWon) });
    }

    var assetCarNote = '';
    var repAsset = sum.representativeAssetManwon;
    if (user && user.assetManwon !== null && user.assetManwon !== undefined && repAsset) {
      if (Number(user.assetManwon) <= repAsset) {
        assetCarNote = sum.assetKind + ' ' + formatManwon(repAsset * 10000) + ' 이하 참고 범위';
        cmpItems.push({ status: 'ok', text: sum.assetKind + ' 참고: ' + formatManwon(repAsset * 10000) + ' 이하' });
      } else {
        assetCarNote = sum.assetKind + ' 대표한도(' + formatManwon(repAsset * 10000) + ') 초과 가능';
        cmpItems.push({ status: 'warn', text: sum.assetKind + ' 참고: ' + formatManwon(repAsset * 10000) + ' 초과' });
      }
    } else if (repAsset) {
      assetCarNote = sum.assetKind + ' 대표한도 ' + formatManwon(repAsset * 10000);
      cmpItems.push({ status: 'neutral', text: sum.assetKind + ' 참고: ' + formatManwon(repAsset * 10000) + ' 이하' });
    }

    var repCar = sum.representativeCarManwon;
    if (repCar === null) {
      cmpItems.push({ status: 'neutral', text: '차량 참고: 별도 한도 없음(유형별 확인)' });
    } else if (user && user.carStatus === 'none') {
      cmpItems.push({ status: 'ok', text: '차량 참고: 미보유' });
    } else if (user && user.carStatus === 'le_4542') {
      cmpItems.push({ status: 'ok', text: '차량 참고: ' + formatManwon(repCar * 10000) + ' 이하' });
    } else if (user && user.carStatus === 'over_4542') {
      cmpItems.push({ status: 'warn', text: '차량 참고: ' + formatManwon(repCar * 10000) + ' 초과(출산가산 확인)' });
    } else {
      cmpItems.push({ status: 'neutral', text: '차량 참고: ' + formatManwon(repCar * 10000) + ' 이하' });
    }

    return {
      version: defaults.version,
      sourceTitle: defaults.sourceTitle,
      typeKey: spec.key,
      typeLabel: spec.label,
      pages: spec.pages,
      incomeBase: spec.incomeBase,
      incomeBaseLabel: spec.incomeBaseLabel,
      summary: sum,
      ranks: spec.ranks,
      notes: spec.notes,
      message: message,
      userCompare: {
        incomeNote: incomeNote,
        assetCarNote: assetCarNote,
        items: cmpItems
      }
    };
  }

  function evaluateGenericNotice(user, notice, refDate) {
    var meta = notice._meta || {};
    var checks = {};
    var rp = checkRegionAndPeriod(user, notice, null, refDate);
    checks.regionPeriod = { label: '지역·접수기간', status: rp.status, reason: rp.reason };

    var hints = meta.target_hints || [];
    var isSingle = user.marital === 'single';
    var isMarriedOrParent = !isSingle;
    var isSenior = user.ageBand === '65plus';
    var isYouthAge = user.ageBand === '19_39';

    // Obvious title-based target mismatch exclusions only
    var targetStatus = 'check';
    var targetReason = '공고별 모집 계층·세부 연령·혼인 조건이 목록에 없어 공고문 확인이 필요합니다';

    if (hints.indexOf('철거민') >= 0) {
      targetStatus = 'fail';
      targetReason = '당해 사업지구 철거민 전용 공고입니다';
    } else if (hints.indexOf('기숙사') >= 0 && (notice.title || '').indexOf('기업체 기숙사') >= 0) {
      targetStatus = 'fail';
      targetReason = '기업체 기숙사 전용 공급 공고입니다';
    } else if (hints.indexOf('고령자') >= 0 && hints.indexOf('청년') < 0 && hints.indexOf('신혼·신생아') < 0 && !isSenior) {
      targetStatus = 'fail';
      targetReason = '고령자(어르신) 전용 공고입니다';
    } else if (hints.indexOf('청년') >= 0 && hints.indexOf('신혼·신생아') < 0 && hints.indexOf('고령자') < 0) {
      if (isMarriedOrParent || isSenior) {
        targetStatus = 'fail';
        targetReason = '청년 전용 공고입니다 (기혼·고령자 제외)';
      } else if (isYouthAge) {
        targetReason = '제목상 청년 공고로 보이나, 세부 연령·소득기간 조건을 공고문에서 확인해야 합니다';
      }
    } else if (hints.indexOf('신혼·신생아') >= 0 && hints.indexOf('청년') < 0 && hints.indexOf('고령자') < 0) {
      if (isSingle) {
        targetStatus = 'fail';
        targetReason = '신혼·신생아(신혼희망) 전용 공고입니다 (미혼 단독 제외)';
      } else {
        targetReason = '제목상 신혼·신생아 공고로 보이나, 혼인기간·자녀·자격 조건을 공고문에서 확인해야 합니다';
      }
    }
    checks.target = { label: '모집 계층', status: targetStatus, reason: targetReason };

    // Homeless check
    var homelessStatus = 'check';
    var homelessReason = '공고별 무주택 범위(본인 vs 세대구성원 전원)가 목록에 없어 확인이 필요합니다';
    if (user.housing === 'owner' && hints.indexOf('무주택완화') < 0) {
      homelessStatus = 'fail';
      homelessReason = '유주택자입니다 (제목에 무주택 요건 완화 표기가 없는 일반 공고 제외)';
    } else if (user.housing === 'all_homeless') {
      homelessReason = '세대구성원 전원 무주택이나, 공고별 세부 무주택 유지요건 확인 필요';
    }
    checks.homeless = { label: '무주택', status: homelessStatus, reason: homelessReason };

    var manualRef = buildManualReference(user, notice, MANUAL_DEFAULTS);

    var incomeReason = '수집 목록에 공고별 도시근로자 월평균소득 기준표(%)가 아직 없어 확인이 필요합니다';
    var assetCarReason = '수집 목록에 공고별 총자산·자동차 한도가 아직 없어 확인이 필요합니다';
    if (manualRef) {
      incomeReason = '공고문 확인 필요 · [업무매뉴얼 ' + manualRef.version + '판 ' + manualRef.typeLabel + ' 참고] ' +
        manualRef.incomeBaseLabel + ' ' + manualRef.summary.incomeText +
        (manualRef.userCompare.incomeNote ? ' (' + manualRef.userCompare.incomeNote + ')' : '');
      assetCarReason = '공고문 확인 필요 · [업무매뉴얼 ' + manualRef.version + '판 ' + manualRef.typeLabel + ' 참고] ' +
        manualRef.summary.assetText + ', ' + manualRef.summary.carText +
        (manualRef.userCompare.assetCarNote ? ' (' + manualRef.userCompare.assetCarNote + ')' : '');
    }

    checks.income = {
      label: '소득',
      status: 'check',
      reason: incomeReason
    };
    checks.assetCar = {
      label: '자산·자동차',
      status: 'check',
      reason: assetCarReason
    };

    var allList = [checks.regionPeriod, checks.target, checks.homeless, checks.income, checks.assetCar];
    var failItem = allList.find(function (c) { return c.status === 'fail'; });
    // Principle: never classify generic notices without exact notice rules as 'eligible'
    var overall = failItem ? 'excluded' : 'needs_check';

    var summaryReason = '';
    if (overall === 'excluded') {
      summaryReason = failItem.label + ' 미충족: ' + failItem.reason;
    } else {
      var missingParts = ['자격·소득·자산 한도'];
      if (!rp.applyEnd) missingParts.push('접수 마감일');
      if (user.hopeSido !== '전국' && user.hopeSigungu && (meta.sigungu_hints || []).indexOf(user.hopeSigungu) < 0) {
        missingParts.push('세부 시·군·구');
      }
      summaryReason = '공고문 확인 필요 (' + missingParts.join(' · ') + ' 미수집)';
    }

    var notes = ['수집 에이전트 기본 목록에는 공고별 자격·소득·자산 기준이 없어 원 공고문 확인이 필요합니다.'];
    if (manualRef) {
      notes.push('공공주택 업무매뉴얼(' + manualRef.version + '판, ' + manualRef.pages + ') ' + manualRef.typeLabel + ' 기본 기준은 참고용이며, 이 기준만으로 신청 가능을 단정하지 않습니다.');
    }

    return {
      notice: notice,
      overall: overall,
      summaryReason: summaryReason,
      checks: checks,
      dday: rp.dday,
      applyEnd: rp.applyEnd,
      wpPostUrl: meta.wp_post_url || null,
      hasVerifiedRules: false,
      finalRank: null,
      matchedUnits: [],
      notes: notes,
      manualRef: manualRef
    };
  }

  function evaluateNotice(user, notice, rulesMap, refDate) {
    var rules = rulesMap || DEFAULT_RULES || {};
    var rule = rules[notice.key];
    if (rule) {
      return evaluate1130Notice(user, notice, rule, refDate);
    }
    return evaluateGenericNotice(user, notice, refDate);
  }

  function compareClosingSoon(a, b) {
    var aHasEnd = Boolean(a.applyEnd);
    var bHasEnd = Boolean(b.applyEnd);
    if (aHasEnd && !bHasEnd) return -1;
    if (!aHasEnd && bHasEnd) return 1;
    if (aHasEnd && bHasEnd && a.applyEnd !== b.applyEnd) {
      return a.applyEnd < b.applyEnd ? -1 : 1;
    }
    // Verified detailed rules first among ties, then newest posted_date
    if (a.hasVerifiedRules !== b.hasVerifiedRules) return a.hasVerifiedRules ? -1 : 1;
    var pa = a.notice.posted_date || '';
    var pb = b.notice.posted_date || '';
    if (pa !== pb) return pa > pb ? -1 : 1;
    return (a.notice.key || '') > (b.notice.key || '') ? -1 : 1;
  }

  function isClosedNotice(notice, rule, refDate) {
    if (!notice) return true;
    if (String(notice.status || '').trim() === '접수마감') return true;
    var applyEnd = String(notice.apply_end || (rule && rule.apply_end_pdf) || '').trim();
    if (!applyEnd) return false;
    var dday = daysBetween(refDate, applyEnd);
    return dday !== null && dday < 0;
  }

  function evaluateAll(user, notices, rulesMap, refDate) {
    var rules = rulesMap || DEFAULT_RULES || {};
    var eligible = [];
    var needsCheck = [];
    var excluded = [];
    var closedRemoved = 0;
    var excludedByReason = {
      nonHousing: 0,
      superseded: 0,
      closed: 0,
      typeMismatch: 0,
      regionMismatch: 0,
      conditionMismatch: 0
    };

    for (var i = 0; i < notices.length; i++) {
      var rule = rules[notices[i].key];
      if (isClosedNotice(notices[i], rule, refDate)) {
        closedRemoved++;
        continue;
      }
      var res = evaluateNotice(user, notices[i], rules, refDate);
      if (res.overall === 'eligible') {
        eligible.push(res);
      } else if (res.overall === 'needs_check') {
        needsCheck.push(res);
      } else {
        excluded.push(res);
        var rMsg = res.summaryReason || '';
        if (rMsg.indexOf('주거 모집 공고가 아닙니다') >= 0) excludedByReason.nonHousing++;
        else if (rMsg.indexOf('대체된 이전 공고') >= 0) excludedByReason.superseded++;
        else if (rMsg.indexOf('접수 마감') >= 0) excludedByReason.closed++;
        else if (rMsg.indexOf('희망 유형') >= 0) excludedByReason.typeMismatch++;
        else if (rMsg.indexOf('희망 지역') >= 0 || rMsg.indexOf('희망 시·군·구') >= 0 || rMsg.indexOf('경기북부 대상') >= 0) excludedByReason.regionMismatch++;
        else excludedByReason.conditionMismatch++;
      }
    }

    eligible.sort(compareClosingSoon);
    needsCheck.sort(compareClosingSoon);

    return {
      eligible: eligible,
      needsCheck: needsCheck,
      excluded: excluded,
      closedRemoved: closedRemoved,
      excludedByReason: excludedByReason,
      total: eligible.length + needsCheck.length + excluded.length,
      refDate: refDate
    };
  }

  return {
    formatWon: formatWon,
    formatManwon: formatManwon,
    daysBetween: daysBetween,
    parseCsvText: parseCsvText,
    isClosedNotice: isClosedNotice,
    resolveManualTypeKey: resolveManualTypeKey,
    evaluateNotice: evaluateNotice,
    evaluateAll: evaluateAll
  };
});

function __kkeobiBootNoticeMatch() {
  if (window.__kkeobiNoticeMatchBooted) return;
  if (!document.getElementById('questionStage')) return;
  window.__kkeobiNoticeMatchBooted = true;
/* UI controller for Screen A (12-item wizard + region/type), Screen B (3-bucket results), Screen C (detail links).
 * Strictly in-memory: never persists user inputs to browser storage or sends them to external servers. */
(function () {
  'use strict';

  var Matcher = window.NoticeMatcher;
  var Rules = window.NOTICE_RULES || {};
  var Datasets = (window.NOTICE_DATASETS && window.NOTICE_DATASETS.sources) || {};

  var SIDO_LIST = [
    '전국', '경기', '서울', '인천', '부산', '대구', '대전', '울산', '세종',
    '강원', '충북', '충남', '전북', '광주·전남', '경북', '경남', '제주'
  ];

  var SIGUNGU_BY_SIDO = {
    '경기': ['수원시', '용인시', '화성시', '성남시', '안산시', '이천시', '파주시', '평택시', '시흥시', '안성시', '의정부시', '남양주시', '연천군', '광주시', '안양시', '부천시', '김포시'],
    '서울': ['강남구', '송파구', '강동구', '서초구', '마포구', '금천구', '동작구', '구로구'],
    '인천': ['남동구'],
    '부산': ['수영구'],
    '대구': ['달서구', '달성군'],
    '대전': ['유성구', '대덕구'],
    '충남': ['천안시', '아산시'],
    '충북': ['증평군'],
    '경북': ['영주시', '칠곡군'],
    '경남': ['양산시']
  };

  var PRESETS = {
    suwon_youth: {
      ageBand: '19_39', householdSize: 1, housing: 'self_only', marital: 'single',
      dualIncome: 'single', marriedPeriodStatus: 'within7', singleParentChildAge: 'le6',
      childrenCount: 0, birthChildrenAfter230328: 0, youthHasIncome: 'working', youthWorkYears: 'le5',
      subscription: false, incomeManwon: 320, assetManwon: 12000, carStatus: 'none', carValueManwon: null,
      vulnerabilities: [], hopeSido: '경기', hopeSigungu: '수원시', hopeType: 'rental'
    },
    suwon_newlywed: {
      ageBand: '19_39', householdSize: 3, housing: 'all_homeless', marital: 'newlywed',
      dualIncome: 'dual', marriedPeriodStatus: 'within7', singleParentChildAge: 'le6',
      childrenCount: 1, birthChildrenAfter230328: 1, youthHasIncome: 'none', youthWorkYears: '0',
      subscription: true, incomeManwon: 850, assetManwon: 28000, carStatus: 'le_4542', carValueManwon: 2200,
      vulnerabilities: [], hopeSido: '경기', hopeSigungu: '수원시', hopeType: 'rental'
    },
    suwon_senior: {
      ageBand: '65plus', householdSize: 1, housing: 'all_homeless', marital: 'single',
      dualIncome: 'single', marriedPeriodStatus: 'within7', singleParentChildAge: 'le6',
      childrenCount: 0, birthChildrenAfter230328: 0, youthHasIncome: 'none', youthWorkYears: '0',
      subscription: true, incomeManwon: 150, assetManwon: 10000, carStatus: 'none', carValueManwon: null,
      vulnerabilities: [], hopeSido: '경기', hopeSigungu: '수원시', hopeType: 'rental'
    },
    seoul_youth: {
      ageBand: '19_39', householdSize: 1, housing: 'self_only', marital: 'single',
      dualIncome: 'single', marriedPeriodStatus: 'within7', singleParentChildAge: 'le6',
      childrenCount: 0, birthChildrenAfter230328: 0, youthHasIncome: 'none', youthWorkYears: '0',
      subscription: false, incomeManwon: 0, assetManwon: 5000, carStatus: 'none', carValueManwon: null,
      vulnerabilities: [], hopeSido: '서울', hopeSigungu: '', hopeType: 'rental'
    }
  };

  function createInitialState() {
    return {
      ageBand: '19_39',
      householdSize: 1,
      housing: 'all_homeless',
      marital: 'single',
      dualIncome: 'single',
      marriedPeriodStatus: '7to10',
      singleParentChildAge: 'le6',
      childrenCount: 0,
      birthChildrenAfter230328: 0,
      youthHasIncome: 'working',
      youthWorkYears: 'le5',
      subscription: true,
      incomeManwon: 320,
      assetManwon: 12000,
      carStatus: 'none',
      carValueManwon: null,
      vulnerabilities: [],
      hopeSido: '경기',
      hopeSigungu: '수원시',
      hopeType: 'all'
    };
  }

  var state = {
    user: createInitialState(),
    currentStepIndex: 0,
    screen: 'A',
    datasetKey: 'full',
    customNotices: null,
    customLabel: '',
    refDate: '2026-11-25',
    checkFilter: 'all',
    lastEvaluation: null
  };

  var els = {
    screenA: document.getElementById('screenA'),
    screenB: document.getElementById('screenB'),
    stepCounter: document.getElementById('stepCounter'),
    stepSectionTag: document.getElementById('stepSectionTag'),
    progressFill: document.getElementById('progressFill'),
    stepDots: document.getElementById('stepDots'),
    questionStage: document.getElementById('questionStage'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    resetInputBtn: document.getElementById('resetInputBtn'),
    editInputsBtn: document.getElementById('editInputsBtn'),
    resetAllBtn: document.getElementById('resetAllBtn'),
    inputChips: document.getElementById('inputChips'),
    countEligible: document.getElementById('countEligible'),
    countCheck: document.getElementById('countCheck'),
    countExcluded: document.getElementById('countExcluded'),
    excludedSummaryToggle: document.getElementById('excludedSummaryToggle'),
    excludedBreakdown: document.getElementById('excludedBreakdown'),
    eligibleList: document.getElementById('eligibleList'),
    checkFilterBar: document.getElementById('checkFilterBar'),
    checkList: document.getElementById('checkList'),
    datasetMeta: document.getElementById('datasetMeta'),
    datasetSelect: document.getElementById('datasetSelect'),
    refDateInput: document.getElementById('refDateInput'),
    csvFileInput: document.getElementById('csvFileInput'),
    modal: document.getElementById('screenCModal'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalBadges: document.getElementById('modalBadges'),
    modalTitle: document.getElementById('modalTitle'),
    modalMeta: document.getElementById('modalMeta'),
    modalChecks: document.getElementById('modalChecks'),
    modalUnitsWrap: document.getElementById('modalUnitsWrap'),
    modalScheduleWrap: document.getElementById('modalScheduleWrap'),
    modalNotesWrap: document.getElementById('modalNotesWrap'),
    modalLinkNotice: document.getElementById('modalLinkNotice'),
    modalWpBtn: document.getElementById('modalWpBtn'),
    modalOrigBtn: document.getElementById('modalOrigBtn')
  };

  function getActiveSteps() {
    var base = [
      { id: 'age', short: '나이', section: '기본 자격' },
      { id: 'household', short: '세대원', section: '기본 자격' },
      { id: 'housing', short: '무주택', section: '기본 자격' },
      { id: 'marital', short: '혼인', section: '기본 자격' },
      { id: 'children', short: '자녀', section: '기본 자격' }
    ];
    if (state.user.marital === 'single' && state.user.ageBand !== '65plus') {
      base.push({ id: 'youthIncome', short: '청년소득', section: '청년 전용' });
      base.push({ id: 'youthWork', short: '종사기간', section: '청년 전용' });
    }
    base.push(
      { id: 'subscription', short: '청약통장', section: '소득·자산' },
      { id: 'income', short: '월소득', section: '소득·자산' },
      { id: 'asset', short: '총자산', section: '소득·자산' },
      { id: 'car', short: '자동차', section: '소득·자산' },
      { id: 'vuln', short: '취약계층', section: '취약계층' },
      { id: 'region', short: '희망지역', section: '희망 조건' }
    );
    return base;
  }

  function filterActiveNotices(rows) {
    if (!Array.isArray(rows)) return [];
    return rows.filter(function (r) {
      return !Matcher.isClosedNotice(r, Rules[r.key], state.refDate);
    });
  }

  function getCurrentNotices() {
    if (state.customNotices) return filterActiveNotices(state.customNotices);
    var src = Datasets[state.datasetKey] || Datasets.full || { rows: [] };
    return filterActiveNotices(src.rows || []);
  }

  function syncDatasetSelectLabels() {
    if (!els.datasetSelect) return;
    Array.prototype.forEach.call(els.datasetSelect.options, function (opt) {
      var src = Datasets[opt.value];
      if (!src) return;
      var activeCount = filterActiveNotices(src.rows || []).length;
      var shortLabel = src.label || opt.value;
      opt.textContent = shortLabel + ' · ' + activeCount + '건';
    });
  }

  function updateDatasetInfo() {
    syncDatasetSelectLabels();
    var rows = getCurrentNotices();
    var verifiedCount = rows.filter(function (r) { return r._meta && r._meta.has_verified_rules; }).length;
    var label = state.customNotices
      ? state.customLabel
      : ((Datasets[state.datasetKey] && Datasets[state.datasetKey].label) || '기본 목록');
    if (rows.length === 0 && state.remoteLoading) {
      els.datasetMeta.textContent = '공고 목록 불러오는 중...';
      return;
    }
    els.datasetMeta.textContent = label + ' · 총 ' + rows.length + '건 (자격 조건 원문 대조 완료 ' + verifiedCount + '건)';
  }

  function renderOptionButtons(options, currentVal, onSelect, narrow) {
    var grid = document.createElement('div');
    grid.className = 'options-grid' + (narrow ? ' cols-narrow' : '');
    options.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opt-btn' + (opt.value === currentVal ? ' selected' : '');
      btn.innerHTML = '<span class="opt-title">' + escapeHtml(opt.label) + '</span>' +
        (opt.sub ? '<span class="opt-sub">' + escapeHtml(opt.sub) + '</span>' : '');
      btn.addEventListener('click', function () {
        onSelect(opt.value);
      });
      grid.appendChild(btn);
    });
    return grid;
  }

  function escapeHtml(str) {
    return String(str === null || str === undefined ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderQuestionStage() {
    var steps = getActiveSteps();
    if (state.currentStepIndex >= steps.length) state.currentStepIndex = steps.length - 1;
    if (state.currentStepIndex < 0) state.currentStepIndex = 0;

    var step = steps[state.currentStepIndex];
    var total = steps.length;

    els.stepCounter.textContent = '질문 ' + (state.currentStepIndex + 1) + ' / ' + total;
    els.stepSectionTag.textContent = step.section;
    els.progressFill.style.width = Math.round(((state.currentStepIndex + 1) / total) * 100) + '%';

    // Step dots
    els.stepDots.innerHTML = '';
    steps.forEach(function (s, idx) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'step-dot-btn' + (idx === state.currentStepIndex ? ' active' : (idx < state.currentStepIndex ? ' done' : ''));
      dot.textContent = (idx + 1) + '.' + s.short;
      dot.addEventListener('click', function () {
        state.currentStepIndex = idx;
        renderQuestionStage();
      });
      els.stepDots.appendChild(dot);
    });

    els.prevBtn.disabled = state.currentStepIndex === 0;
    els.nextBtn.textContent = state.currentStepIndex === total - 1 ? '내 맞춤 공고 보기 →' : '다음';

    var stage = els.questionStage;
    stage.innerHTML = '';
    var u = state.user;

    var h = document.createElement('h2');
    h.className = 'q-title';
    var p = document.createElement('p');
    p.className = 'q-helper';
    stage.appendChild(h);
    stage.appendChild(p);

    if (step.id === 'age') {
      h.textContent = '현재 연령대가 어디에 해당하나요?';
      p.textContent = '공고일 기준 만 나이로 청년(19~39세)·고령자(65세 이상) 계층을 판별합니다.';
      stage.appendChild(renderOptionButtons([
        { value: 'under19', label: '만 18세 이하', sub: '미성년자 (청년은 19세~)' },
        { value: '19_39', label: '만 19~39세', sub: '청년·사회초년생 가능' },
        { value: '40_64', label: '만 40~64세', sub: '일반·신혼·사회초년생' },
        { value: '65plus', label: '만 65세 이상', sub: '고령자 계층' }
      ], u.ageBand, function (val) {
        u.ageBand = val;
        renderQuestionStage();
      }));
    } else if (step.id === 'household') {
      h.textContent = '함께 사는 세대원 수는 몇 명인가요?';
      p.textContent = '신청자 본인을 포함한 가구원 수입니다. 도시근로자 월평균소득 기준을 고를 때 사용합니다.';
      stage.appendChild(renderOptionButtons([
        { value: 1, label: '1명 (단독)' },
        { value: 2, label: '2명' },
        { value: 3, label: '3명' },
        { value: 4, label: '4명' },
        { value: 5, label: '5명' },
        { value: 6, label: '6명' },
        { value: 7, label: '7명 이상' }
      ], u.householdSize, function (val) {
        u.householdSize = val;
        renderQuestionStage();
      }, true));
    } else if (step.id === 'housing') {
      h.textContent = '집을 보유하고 계신가요? (무주택 여부)';
      p.textContent = '청년 계층은 본인만 무주택이어도 신청 가능한 공고가 많고, 신혼부부·일반 공고는 세대구성원 전원 무주택이 필요합니다.';
      stage.appendChild(renderOptionButtons([
        { value: 'all_homeless', label: '세대구성원 전부 무주택', sub: '가장 많은 공고 신청 가능' },
        { value: 'self_only', label: '본인만 무주택 (무주택자)', sub: '동거 가족 등 주택 보유 시 (청년 전용)' },
        { value: 'owner', label: '유주택 (분양권·입주권 포함)', sub: '무주택 요건 완화 공고 외 제외' }
      ], u.housing, function (val) {
        u.housing = val;
        renderQuestionStage();
      }));
    } else if (step.id === 'marital') {
      h.textContent = '현재 혼인 상태는 어떻게 되시나요?';
      p.textContent = '혼인 상태에 따라 청년, 신혼부부, 예비신혼부부, 한부모가족 계층이 나뉩니다.';
      stage.appendChild(renderOptionButtons([
        { value: 'single', label: '미혼' },
        { value: 'engaged', label: '예비신혼부부', sub: '입주 전 혼인 증명' },
        { value: 'newlywed', label: '신혼부부', sub: '혼인 7년 이내 또는 6세 이하 자녀' },
        { value: 'married_over7', label: '혼인 중 (7년 초과)', sub: '6세 이하 자녀 없음' },
        { value: 'single_parent', label: '한부모가족', sub: '미성년 자녀 양육' }
      ], u.marital, function (val) {
        u.marital = val;
        renderQuestionStage();
      }));

      if (u.marital === 'engaged' || u.marital === 'newlywed' || u.marital === 'married_over7') {
        var subDual = document.createElement('div');
        subDual.className = 'sub-box';
        subDual.innerHTML = '<p class="sub-box-title">부부 맞벌이 여부 (신혼부부 소득 완화 기준 판별용)</p>';
        subDual.appendChild(renderOptionButtons([
          { value: 'single', label: '외벌이 (1인 소득)' },
          { value: 'dual', label: '맞벌이 (부부 모두 소득)' },
          { value: 'unknown', label: '잘 모르겠어요' }
        ], u.dualIncome, function (val) {
          u.dualIncome = val;
          renderQuestionStage();
        }, true));
        stage.appendChild(subDual);
      }

      if (u.marital === 'married_over7') {
        var subOver = document.createElement('div');
        subOver.className = 'sub-box';
        subOver.innerHTML = '<p class="sub-box-title">완화조건(2순위): 혼인 7~10년 이내 또는 만 7~9세 자녀가 있나요?</p>';
        subOver.appendChild(renderOptionButtons([
          { value: '7to10', label: '예, 해당합니다' },
          { value: 'over10', label: '아니오 (10년 초과)' },
          { value: 'unknown', label: '잘 모르겠어요' }
        ], u.marriedPeriodStatus, function (val) {
          u.marriedPeriodStatus = val;
          renderQuestionStage();
        }, true));
        stage.appendChild(subOver);
      }

      if (u.marital === 'single_parent') {
        var subSp = document.createElement('div');
        subSp.className = 'sub-box';
        subSp.innerHTML = '<p class="sub-box-title">가장 어린 자녀의 나이가 어떻게 되나요? (태아 포함)</p>';
        subSp.appendChild(renderOptionButtons([
          { value: 'le6', label: '만 6세 이하' },
          { value: '7to9', label: '만 7~9세 (완화조건)' },
          { value: 'ge10', label: '만 10세 이상' },
          { value: 'unknown', label: '잘 모르겠어요' }
        ], u.singleParentChildAge, function (val) {
          u.singleParentChildAge = val;
          renderQuestionStage();
        }, true));
        stage.appendChild(subSp);
      }
    } else if (step.id === 'children') {
      h.textContent = '미성년 자녀(태아 포함)가 몇 명 있나요?';
      p.textContent = '출산자녀 수에 따라 소득·자산 한도가 10%~20% 가산되는 공고가 있습니다.';
      stage.appendChild(renderOptionButtons([
        { value: 0, label: '0명' },
        { value: 1, label: '1명' },
        { value: 2, label: '2명' },
        { value: 3, label: '3명 이상' }
      ], u.childrenCount, function (val) {
        u.childrenCount = val;
        if (val === 0) u.birthChildrenAfter230328 = 0;
        renderQuestionStage();
      }, true));

      if (u.childrenCount >= 1) {
        var subBirth = document.createElement('div');
        subBirth.className = 'sub-box';
        subBirth.innerHTML = '<p class="sub-box-title">2023년 3월 28일 이후 출생한 자녀(입양·태아 포함)가 있나요?</p>';
        subBirth.appendChild(renderOptionButtons([
          { value: 0, label: '해당 없음 (가산 없음)' },
          { value: 1, label: '1명 (소득·자산 +10% 가산)', sub: '기준일 이후 출산 1인 시' },
          { value: 2, label: '2명 이상 (소득·자산 +20% 가산)', sub: '이후 출산 포함 최대 2자녀 인정' }
        ], u.birthChildrenAfter230328, function (val) {
          u.birthChildrenAfter230328 = val;
          renderQuestionStage();
        }));
        stage.appendChild(subBirth);
      }
    } else if (step.id === 'youthIncome') {
      h.textContent = '현재 본인의 소득 활동 여부는 어떻게 되나요?';
      p.textContent = '1130 공고 등에서 청년 계층은 소득 유무에 따라 임대보증금·월임대료와 사회초년생 자격이 달라집니다.';
      stage.appendChild(renderOptionButtons([
        { value: 'none', label: '소득 없음', sub: '무직·학생 등 (사업·근로소득 없음)' },
        { value: 'working', label: '소득 있음', sub: '근로·사업소득 종사 중' },
        { value: 'retired_artist', label: '퇴직 1년 이내 구직급여 · 예술인', sub: '사회초년생 요건 해당' }
      ], u.youthHasIncome, function (val) {
        u.youthHasIncome = val;
        if (val === 'none') u.youthWorkYears = '0';
        renderQuestionStage();
      }));
    } else if (step.id === 'youthWork') {
      h.textContent = '소득이 있는 업무에 종사한 총 기간은 얼마인가요?';
      p.textContent = '사회초년생(만 40세 이상 미혼 포함)은 총 5년(완화 7년) 이내여야 합니다. 재학 중·병역의무 기간은 제외됩니다.';
      stage.appendChild(renderOptionButtons([
        { value: '0', label: '없음 (0년)' },
        { value: 'le5', label: '5년 이내', sub: '일반조건 (1순위)' },
        { value: '5to7', label: '5년 초과 ~ 7년 이내', sub: '완화조건 (2순위)' },
        { value: 'over7', label: '7년 초과', sub: '사회초년생 완화 한도 초과 (19~39세는 청년 가능)' },
        { value: 'unknown', label: '잘 모르겠어요' }
      ], u.youthWorkYears, function (val) {
        u.youthWorkYears = val;
        renderQuestionStage();
      }));
    } else if (step.id === 'subscription') {
      h.textContent = '주택청약종합저축(청약통장)에 가입되어 있나요?';
      p.textContent = '1130 공고는 신청 시 미가입자도 청약 가능하며 입주 전까지 가입사실을 증명하면 됩니다.';
      stage.appendChild(renderOptionButtons([
        { value: true, label: '가입했어요', sub: '본인 또는 배우자(신혼 시) 가입' },
        { value: false, label: '아직 미가입', sub: '입주 전 가입 가능 공고 확인' }
      ], u.subscription, function (val) {
        u.subscription = val;
        renderQuestionStage();
      }));
    } else if (step.id === 'income') {
      h.textContent = '세대 월평균 소득(세전)은 대략 얼마인가요?';
      p.textContent = '청년 세대원(본인)은 본인 소득, 세대주·신혼부부는 세대구성원 전체 세전 월평균소득을 만원 단위로 입력해 주세요.';
      renderNumericStep(stage, {
        value: u.incomeManwon,
        unit: '만원 / 월',
        placeholder: '예: 320',
        chips: [0, 150, 320, 450, 600, 850],
        chipLabel: function (v) { return v === 0 ? '0원' : v + '만원'; },
        onChange: function (val) { u.incomeManwon = val; }
      });
    } else if (step.id === 'asset') {
      h.textContent = '해당 세대 총자산(부동산+금융+자동차−부채)은 얼마인가요?';
      p.textContent = '공고별 총자산 한도(예: 청년 2억 5,100만원, 신혼 3억 4,500만원)와 대조합니다.';
      renderNumericStep(stage, {
        value: u.assetManwon,
        unit: '만원',
        placeholder: '예: 12000',
        chips: [5000, 12000, 24500, 28000, 34500, 36000],
        chipLabel: function (v) { return Matcher.formatManwon(v * 10000); },
        onChange: function (val) { u.assetManwon = val; }
      });
    } else if (step.id === 'car') {
      h.textContent = '보유 중인 자동차(비영업용 승용차)가 있나요?';
      p.textContent = '2대 이상이면 가장 비싼 차량 기준입니다. 장애인 사용 자동차·국가유공자 보철용 차량은 제외될 수 있습니다.';
      stage.appendChild(renderOptionButtons([
        { value: 'none', label: '없어요' },
        { value: 'le_4542', label: '4,542만원 이하', sub: '기본 자동차 한도 충족' },
        { value: 'over_4542', label: '4,542만원 초과', sub: '출산자녀 가산 시 최대 5,451만원' },
        { value: 'unknown', label: '잘 모르겠어요' }
      ], u.carStatus, function (val) {
        u.carStatus = val;
        if (val === 'none') u.carValueManwon = null;
        renderQuestionStage();
      }));

      if (u.carStatus === 'over_4542' || u.carStatus === 'le_4542') {
        var subCar = document.createElement('div');
        subCar.className = 'sub-box';
        subCar.innerHTML = '<p class="sub-box-title">차량가액을 정확히 아시면 입력해 주세요 (선택 사항 · 출산자녀 가산 정밀 비교용)</p>';
        var wrap = document.createElement('div');
        wrap.className = 'num-field-wrap';
        var inp = document.createElement('input');
        inp.type = 'number';
        inp.min = '0';
        inp.className = 'num-input';
        inp.placeholder = '예: 4800';
        inp.value = u.carValueManwon !== null && u.carValueManwon !== undefined ? u.carValueManwon : '';
        inp.addEventListener('input', function () {
          u.carValueManwon = inp.value === '' ? null : Math.max(0, Number(inp.value));
        });
        var unit = document.createElement('span');
        unit.className = 'num-unit';
        unit.textContent = '만원';
        wrap.appendChild(inp);
        wrap.appendChild(unit);
        subCar.appendChild(wrap);
        stage.appendChild(subCar);
      }
    } else if (step.id === 'vuln') {
      h.textContent = '사회취약계층 또는 특례 해당 항목이 있나요?';
      p.textContent = '이지진단과 동일한 항목입니다. 해당하는 항목을 모두 선택하거나, 없으면 그대로 다음으로 넘어가세요.';
      var groups = [
        {
          title: '수급자·차상위',
          items: [
            ['saeng', '생계급여 수급자'],
            ['uiryo', '의료급여 수급자'],
            ['jugeo', '주거급여 수급자'],
            ['gyoyuk', '교육급여 수급자'],
            ['chasan', '차상위계층']
          ]
        },
        {
          title: '그 밖의 자격',
          items: [
            ['merit', '국가유공자 등'],
            ['disabled', '장애인'],
            ['hanCert', '한부모가족증명서 발급'],
            ['nk', '북한이탈주민'],
            ['fac', '아동복지시설·청소년쉼터 퇴소'],
            ['elder', '65세 이상 직계존속 부양']
          ]
        }
      ];

      groups.forEach(function (g) {
        var box = document.createElement('div');
        box.className = 'vuln-group';
        box.innerHTML = '<p class="vuln-group-title">' + escapeHtml(g.title) + '</p>';
        var vg = document.createElement('div');
        vg.className = 'vuln-grid';
        g.items.forEach(function (pair) {
          var key = pair[0], label = pair[1];
          var isOn = u.vulnerabilities.indexOf(key) >= 0;
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'vuln-chip' + (isOn ? ' selected' : '');
          btn.textContent = label;
          btn.addEventListener('click', function () {
            var idx = u.vulnerabilities.indexOf(key);
            if (idx >= 0) u.vulnerabilities.splice(idx, 1);
            else u.vulnerabilities.push(key);
            renderQuestionStage();
          });
          vg.appendChild(btn);
        });
        box.appendChild(vg);
        stage.appendChild(box);
      });

      var noneBtn = document.createElement('button');
      noneBtn.type = 'button';
      noneBtn.className = 'chip-btn' + (u.vulnerabilities.length === 0 ? ' selected' : '');
      noneBtn.textContent = '해당 없음 (선택 해제)';
      noneBtn.addEventListener('click', function () {
        u.vulnerabilities = [];
        renderQuestionStage();
      });
      stage.appendChild(noneBtn);
    } else if (step.id === 'region') {
      h.textContent = '마지막으로 희망 지역과 주택 유형을 선택하세요.';
      p.textContent = '원하는 지역과 유형(임대/분양)만 좁혀 보고, 바로 나에게 맞는 공고를 확인합니다.';

      var sidoWrap = document.createElement('div');
      sidoWrap.className = 'region-sido-grid';
      SIDO_LIST.forEach(function (sd) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'sido-btn' + (u.hopeSido === sd ? ' selected' : '');
        b.textContent = sd;
        b.addEventListener('click', function () {
          u.hopeSido = sd;
          u.hopeSigungu = '';
          renderQuestionStage();
        });
        sidoWrap.appendChild(b);
      });
      stage.appendChild(sidoWrap);

      var sigungus = SIGUNGU_BY_SIDO[u.hopeSido] || [];
      if (sigungus.length > 0) {
        var sgBox = document.createElement('div');
        sgBox.className = 'sub-box';
        sgBox.innerHTML = '<p class="sub-box-title">' + escapeHtml(u.hopeSido) + ' 세부 시·군·구 좁혀보기</p>';
        var sgGrid = document.createElement('div');
        sgGrid.className = 'quick-chips';
        var allBtn = document.createElement('button');
        allBtn.type = 'button';
        allBtn.className = 'chip-btn' + (!u.hopeSigungu ? ' selected' : '');
        allBtn.textContent = u.hopeSido + ' 전체';
        allBtn.addEventListener('click', function () {
          u.hopeSigungu = '';
          renderQuestionStage();
        });
        sgGrid.appendChild(allBtn);

        sigungus.forEach(function (sg) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'chip-btn' + (u.hopeSigungu === sg ? ' selected' : '');
          b.textContent = sg;
          b.addEventListener('click', function () {
            u.hopeSigungu = sg;
            renderQuestionStage();
          });
          sgGrid.appendChild(b);
        });
        sgBox.appendChild(sgGrid);
        stage.appendChild(sgBox);
      }

      var typeBox = document.createElement('div');
      typeBox.className = 'sub-box';
      typeBox.innerHTML = '<p class="sub-box-title">희망 주택 유형</p>';
      typeBox.appendChild(renderOptionButtons([
        { value: 'all', label: '임대 · 분양 모두 보기' },
        { value: 'rental', label: '공공임대만 보기', sub: '행복·국민·영구·매입 등' },
        { value: 'sale', label: '공공분양만 보기', sub: '공공분양·신혼희망타운' }
      ], u.hopeType, function (val) {
        u.hopeType = val;
        renderQuestionStage();
      }, true));
      stage.appendChild(typeBox);
    }
  }

  function renderNumericStep(stage, cfg) {
    var wrap = document.createElement('div');
    wrap.className = 'number-panel';
    var isUnknown = cfg.value === null || cfg.value === undefined || cfg.value === '';

    var row = document.createElement('div');
    row.className = 'number-input-row';

    var fieldWrap = document.createElement('div');
    fieldWrap.className = 'num-field-wrap';
    var inp = document.createElement('input');
    inp.type = 'number';
    inp.min = '0';
    inp.className = 'num-input';
    inp.placeholder = cfg.placeholder;
    inp.value = isUnknown ? '' : cfg.value;
    inp.disabled = isUnknown;

    var unit = document.createElement('span');
    unit.className = 'num-unit';
    unit.textContent = cfg.unit;
    fieldWrap.appendChild(inp);
    fieldWrap.appendChild(unit);

    var unkBtn = document.createElement('button');
    unkBtn.type = 'button';
    unkBtn.className = 'unknown-toggle' + (isUnknown ? ' checked' : '');
    unkBtn.textContent = isUnknown ? '✓ 잘 모르겠어요 (확인 필요로 분류)' : '잘 모르겠어요';

    row.appendChild(fieldWrap);
    row.appendChild(unkBtn);
    wrap.appendChild(row);

    var chipsDiv = document.createElement('div');
    chipsDiv.className = 'quick-chips';
    cfg.chips.forEach(function (val) {
      var cb = document.createElement('button');
      cb.type = 'button';
      cb.className = 'chip-btn' + (!isUnknown && Number(cfg.value) === val ? ' selected' : '');
      cb.textContent = cfg.chipLabel(val);
      cb.addEventListener('click', function () {
        cfg.onChange(val);
        renderQuestionStage();
      });
      chipsDiv.appendChild(cb);
    });
    wrap.appendChild(chipsDiv);

    inp.addEventListener('input', function () {
      cfg.onChange(inp.value === '' ? null : Math.max(0, Number(inp.value)));
    });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        goNext();
      }
    });
    unkBtn.addEventListener('click', function () {
      if (isUnknown) cfg.onChange(cfg.chips[1] || 0);
      else cfg.onChange(null);
      renderQuestionStage();
    });

    stage.appendChild(wrap);
  }

  function buildInputChips() {
    var u = state.user;
    var ageLabels = { under19: '18세 이하', '19_39': '19~39세', '40_64': '40~64세', '65plus': '65세 이상' };
    var housingLabels = { all_homeless: '전원 무주택', self_only: '본인만 무주택', owner: '유주택' };
    var maritalLabels = {
      single: '미혼', engaged: '예비신혼', newlywed: '신혼부부',
      married_over7: '혼인 7년초과', single_parent: '한부모'
    };
    var carLabels = { none: '차량 없음', le_4542: '차량 4,542만↓', over_4542: '차량 4,542만↑', unknown: '차량 미상' };
    var typeLabels = { all: '임대+분양', rental: '공공임대', sale: '공공분양' };

    var steps = getActiveSteps();
    function idxOf(id) {
      var found = steps.findIndex(function (s) { return s.id === id; });
      return found >= 0 ? found : 0;
    }

    var chips = [
      { id: 'age', text: ageLabels[u.ageBand] },
      { id: 'household', text: u.householdSize >= 7 ? '7인 이상' : u.householdSize + '인 가구' },
      { id: 'housing', text: housingLabels[u.housing] },
      { id: 'marital', text: maritalLabels[u.marital] },
      { id: 'children', text: '자녀 ' + u.childrenCount + '명' + (u.birthChildrenAfter230328 > 0 ? '(출산가산 ' + u.birthChildrenAfter230328 + ')' : '') },
      { id: 'income', text: u.incomeManwon === null ? '소득 미상' : '월 ' + u.incomeManwon.toLocaleString('ko-KR') + '만원' },
      { id: 'asset', text: u.assetManwon === null ? '자산 미상' : '자산 ' + Matcher.formatManwon(u.assetManwon * 10000) },
      { id: 'car', text: carLabels[u.carStatus] },
      { id: 'subscription', text: u.subscription ? '청약통장 가입' : '청약 미가입' },
      { id: 'region', text: (u.hopeSigungu ? u.hopeSido + ' ' + u.hopeSigungu : u.hopeSido) + ' · ' + typeLabels[u.hopeType] }
    ];

    els.inputChips.innerHTML = '';
    chips.forEach(function (ch) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'summary-chip';
      b.textContent = ch.text;
      b.title = '클릭하여 수정하기';
      b.addEventListener('click', function () {
        state.currentStepIndex = idxOf(ch.id);
        showScreen('A');
      });
      els.inputChips.appendChild(b);
    });
  }

  function renderNoticeCard(item) {
    var n = item.notice;
    var isEligible = item.overall === 'eligible';
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'notice-card ' + (isEligible ? 'is-eligible' : 'is-check');

    var ddayTag = '';
    if (item.applyEnd) {
      var dText = item.dday === 0 ? '오늘 마감' : (item.dday > 0 ? 'D-' + item.dday : '마감');
      var urgentCls = item.dday !== null && item.dday <= 3 ? ' urgent' : '';
      ddayTag = '<span class="tag tag-dday' + urgentCls + '">' + escapeHtml(dText) + ' (' + escapeHtml(item.applyEnd) + ')</span>';
    } else {
      ddayTag = '<span class="tag tag-check">접수 마감일 공고문 확인</span>';
    }

    var wpTag = item.wpPostUrl ? '<span class="tag tag-wp">상세글 연결</span>' : '';
    var manualTag = (!isEligible && item.manualRef)
      ? '<span class="tag tag-manual">매뉴얼 ' + escapeHtml(item.manualRef.version) + ' 참고</span>'
      : '';
    var regionText = n.region || (n._meta && n._meta.sido) || '미기재';
    var rentHtml = '';
    if (isEligible && item.matchedUnits && item.matchedUnits.length > 0) {
      var preview = item.matchedUnits.map(function (u) {
        return escapeHtml(u.complex) + ' ' + escapeHtml(u.type_name) + ' (' + u.units + '호): 보증금 ' +
          Matcher.formatWon(u.deposit_won) + ' / 월 ' + Matcher.formatWon(u.monthly_rent_won);
      }).join(' · ');
      rentHtml = '<div class="nc-rent-preview">' + preview + '</div>';
    }

    var manualHtml = '';
    if (!isEligible && item.manualRef) {
      var mr = item.manualRef;
      var cmpPills = (mr.userCompare && mr.userCompare.items ? mr.userCompare.items : []).map(function (ci) {
        return '<span class="manual-cmp-pill ' + escapeHtml(ci.status) + '">' + escapeHtml(ci.text) + '</span>';
      }).join('');
      manualHtml =
        '<div class="nc-manual-ref">' +
          '<div class="nc-manual-head">' +
            '<span>공공주택 업무매뉴얼 ' + escapeHtml(mr.version) + '판 · ' + escapeHtml(mr.typeLabel) + ' 기본 기준</span>' +
            '<span>' + escapeHtml(mr.pages) + '</span>' +
          '</div>' +
          '<p class="nc-manual-msg">' + escapeHtml(mr.message) + '</p>' +
          (cmpPills ? '<div class="nc-manual-compare">' + cmpPills + '</div>' : '') +
        '</div>';
    }

    card.innerHTML =
      '<div class="nc-top">' +
        '<div class="nc-badges">' +
          '<span class="tag tag-org">' + escapeHtml(n.org) + '</span>' +
          '<span class="tag tag-type">' + escapeHtml(n.type || '임대') + '</span>' +
          manualTag +
          wpTag +
        '</div>' +
        ddayTag +
      '</div>' +
      '<h4 class="nc-title">' + escapeHtml(n.title) + '</h4>' +
      '<div class="nc-meta">' +
        '<span>지역: ' + escapeHtml(regionText) + '</span>' +
        '<span>게시일: ' + escapeHtml(n.posted_date || '미기재') + '</span>' +
        '<span>상태: ' + escapeHtml(n.status || '공고문 확인') + '</span>' +
      '</div>' +
      '<div class="nc-reason">' + escapeHtml(item.summaryReason) + '</div>' +
      manualHtml +
      rentHtml;

    card.addEventListener('click', function () {
      openModal(item);
    });
    return card;
  }

  function renderCheckFilterBar(needsCheckList) {
    var orgs = ['all'];
    needsCheckList.forEach(function (it) {
      if (orgs.indexOf(it.notice.org) < 0) orgs.push(it.notice.org);
    });
    var items = [
      { key: 'all', label: '전체 (' + needsCheckList.length + ')' }
    ];
    orgs.slice(1).forEach(function (org) {
      var cnt = needsCheckList.filter(function (x) { return x.notice.org === org; }).length;
      items.push({ key: 'org:' + org, label: org + ' (' + cnt + ')' });
    });
    var withDateCnt = needsCheckList.filter(function (x) { return Boolean(x.applyEnd); }).length;
    if (withDateCnt > 0 && withDateCnt < needsCheckList.length) {
      items.push({ key: 'has_end', label: '마감일 확인된 공고만 (' + withDateCnt + ')' });
    }

    els.checkFilterBar.innerHTML = '';
    items.forEach(function (it) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip-btn' + (state.checkFilter === it.key ? ' selected' : '');
      b.textContent = it.label;
      b.addEventListener('click', function () {
        state.checkFilter = it.key;
        renderResults();
      });
      els.checkFilterBar.appendChild(b);
    });
  }

  function renderResults() {
    var notices = getCurrentNotices();
    var ev = Matcher.evaluateAll(state.user, notices, Rules, state.refDate);
    state.lastEvaluation = ev;

    buildInputChips();
    els.countEligible.textContent = ev.eligible.length;
    els.countCheck.textContent = ev.needsCheck.length;
    els.countExcluded.textContent = ev.excluded.length;

    var br = ev.excludedByReason;
    els.excludedSummaryToggle.textContent = '제외된 공고 ' + ev.excluded.length + '건 사유 보기';
    els.excludedBreakdown.innerHTML = [
      ['접수 마감', br.closed],
      ['희망 지역/시군구 불일치', br.regionMismatch],
      ['모집 계층·무주택·소득·자산 불일치', br.conditionMismatch],
      ['정정공고로 대체된 구 공고', br.superseded],
      ['주거 모집 아님 (어린이집·채용 등)', br.nonHousing],
      ['희망 유형 불일치 (임대/분양)', br.typeMismatch]
    ].filter(function (x) { return x[1] > 0; }).map(function (x) {
      return '<span class="ex-pill">' + escapeHtml(x[0]) + ': ' + x[1] + '건</span>';
    }).join('');

    // Eligible list
    els.eligibleList.innerHTML = '';
    if (ev.eligible.length === 0) {
      els.eligibleList.innerHTML =
        '<div class="empty-state">' +
          '<strong>현재 자격 조건까지 모두 맞다고 확인된 공고가 없습니다.</strong><br>' +
          '아래 <strong>확인 필요한 공고</strong>를 눌러 공고문을 직접 확인하거나, 희망 지역을 넓혀 보세요.' +
        '</div>';
    } else {
      ev.eligible.forEach(function (item) {
        els.eligibleList.appendChild(renderNoticeCard(item));
      });
    }

    // Needs check list
    renderCheckFilterBar(ev.needsCheck);
    var filteredCheck = ev.needsCheck.filter(function (it) {
      if (state.checkFilter === 'all') return true;
      if (state.checkFilter === 'has_end') return Boolean(it.applyEnd);
      if (state.checkFilter.indexOf('org:') === 0) {
        return it.notice.org === state.checkFilter.slice(4);
      }
      return true;
    });

    els.checkList.innerHTML = '';
    if (filteredCheck.length === 0) {
      els.checkList.innerHTML = '<div class="empty-state">해당 조건에 맞는 확인 필요 공고가 없습니다.</div>';
    } else {
      filteredCheck.forEach(function (item) {
        els.checkList.appendChild(renderNoticeCard(item));
      });
    }
  }

  function openModal(item) {
    var n = item.notice;
    var badgeLabel = item.overall === 'eligible' ? '신청 가능' : (item.overall === 'needs_check' ? '확인 필요' : '제외');
    var badgeCls = item.overall === 'eligible' ? 'tag-wp' : 'tag-check';

    els.modalBadges.innerHTML =
      '<span class="tag ' + badgeCls + '">' + badgeLabel + '</span>' +
      '<span class="tag tag-org">' + escapeHtml(n.org) + '</span>' +
      '<span class="tag tag-type">' + escapeHtml(n.type || '임대') + '</span>';

    els.modalTitle.textContent = n.title;
    els.modalMeta.innerHTML =
      '<span>공고번호: ' + escapeHtml(n.key) + '</span>' +
      '<span>지역: ' + escapeHtml(n.region || '미기재') + '</span>' +
      '<span>게시일: ' + escapeHtml(n.posted_date || '미기재') + '</span>' +
      '<span>접수마감: ' + escapeHtml(item.applyEnd || '공고문 확인 필요') + '</span>';

    var order = ['target', 'homeless', 'income', 'assetCar', 'regionPeriod'];
    var statusLabel = { pass: '충족', check: '확인 필요', fail: '미충족' };
    els.modalChecks.innerHTML = order.map(function (k) {
      var c = item.checks[k];
      return '<div class="check-row ' + escapeHtml(c.status) + '">' +
        '<div class="check-label">' + escapeHtml(c.label) + ' (' + (statusLabel[c.status] || c.status) + ')</div>' +
        '<div>' + escapeHtml(c.reason) + '</div>' +
      '</div>';
    }).join('');

    if (item.hasVerifiedRules && Rules[n.key]) {
      var rule = Rules[n.key];
      var unitsToShow = item.matchedUnits && item.matchedUnits.length > 0 ? item.matchedUnits : rule.supply_units;
      els.modalUnitsWrap.classList.remove('hidden');
      els.modalUnitsWrap.innerHTML =
        '<strong>해당 단지·임대조건 (공고문 PDF 원문 기준)</strong>' +
        '<table class="unit-table"><thead><tr><th>단지·형별</th><th>대상</th><th>모집</th><th>보증금</th><th>월임대료</th><th>계약금</th></tr></thead><tbody>' +
        unitsToShow.map(function (u) {
          return '<tr><td>' + escapeHtml(u.complex) + ' ' + escapeHtml(u.type_name) + '</td><td>' +
            escapeHtml(u.target) + '</td><td>' + u.units + '호</td><td>' +
            Matcher.formatWon(u.deposit_won) + '</td><td>' + Matcher.formatWon(u.monthly_rent_won) + '</td><td>' +
            Matcher.formatWon(u.contract_deposit_won) + '</td></tr>';
        }).join('') +
        '</tbody></table>';

      els.modalScheduleWrap.classList.remove('hidden');
      els.modalScheduleWrap.innerHTML =
        '<strong>공급 일정 (PDF p.11·대조표 기준)</strong><br>' +
        '• 접수: ' + escapeHtml(rule.schedule.apply) + '<br>' +
        '• 서류제출대상자 발표: ' + escapeHtml(rule.schedule.doc_target_announce) + '<br>' +
        '• 서류제출: ' + escapeHtml(rule.schedule.doc_submit) + '<br>' +
        '• 당첨자 발표: ' + escapeHtml(rule.schedule.winner_announce) + '<br>' +
        '• 계약 체결: ' + escapeHtml(rule.schedule.contract) + '<br>' +
        '• 입주 예정: ' + escapeHtml(rule.schedule.move_in);
    } else if (item.manualRef) {
      var mr = item.manualRef;
      els.modalUnitsWrap.classList.remove('hidden');
      els.modalUnitsWrap.innerHTML =
        '<div class="manual-ref-head">' +
          '<strong>유형별 기본 기준 참고 (공공주택 업무매뉴얼 ' + escapeHtml(mr.version) + '판 · ' + escapeHtml(mr.typeLabel) + ')</strong>' +
          '<span class="tag tag-manual">' + escapeHtml(mr.pages) + '</span>' +
        '</div>' +
        '<p class="manual-ref-msg">' + escapeHtml(mr.message) + '</p>' +
        '<table class="unit-table"><thead><tr><th>순위·계층</th><th>소득 기준 (' + escapeHtml(mr.incomeBaseLabel) + ')</th><th>자산 한도</th><th>자동차 한도</th></tr></thead><tbody>' +
        mr.ranks.map(function (rk) {
          var assetText = rk.assetManwon ? Matcher.formatManwon(rk.assetManwon * 10000) + ' 이하' : '자격별 확인';
          if (rk.assetNote) assetText += ' (' + rk.assetNote + ')';
          var carText = rk.carManwon === 0 ? '미소유' : (rk.carManwon ? Matcher.formatManwon(rk.carManwon * 10000) + ' 이하' : (rk.carNote || '해당 없음/확인'));
          if (rk.carManwon && rk.carNote && rk.carNote.indexOf('4,542') < 0) carText += ' (' + rk.carNote + ')';
          return '<tr><td>' + escapeHtml(rk.rank) + '</td><td>' + escapeHtml(rk.incomePctText) + '</td><td>' +
            escapeHtml(assetText) + '</td><td>' + escapeHtml(carText) + '</td></tr>';
        }).join('') +
        '</tbody></table>' +
        '<p class="manual-ref-disclaimer">※ 공공주택 업무매뉴얼(' + escapeHtml(mr.version) + '판) 일반 기준 참고용이며, 이 기준만으로 \'신청 가능\'을 단정하지 않습니다. 정확한 기준은 공고문 원문을 확인하세요.</p>';
      els.modalScheduleWrap.classList.add('hidden');
    } else {
      els.modalUnitsWrap.classList.add('hidden');
      els.modalScheduleWrap.classList.add('hidden');
    }

    if (item.notes && item.notes.length > 0) {
      els.modalNotesWrap.classList.remove('hidden');
      els.modalNotesWrap.innerHTML = '<strong>참고 안내</strong><br>' +
        item.notes.map(function (nt) { return '• ' + escapeHtml(nt); }).join('<br>');
    } else {
      els.modalNotesWrap.classList.add('hidden');
    }

    if (item.wpPostUrl) {
      els.modalWpBtn.href = item.wpPostUrl;
      els.modalWpBtn.classList.remove('hidden');
      els.modalLinkNotice.textContent = '꺼비노트에 이미 게시된 상세 글과 원 공고를 바로 열 수 있습니다.';
    } else {
      els.modalWpBtn.classList.add('hidden');
      els.modalLinkNotice.textContent = '이 공고는 아직 꺼비노트 상세 글(wp_post_url)이 연결되어 있지 않아 원 공고 페이지로 연결합니다.';
    }
    els.modalOrigBtn.href = n.detail_url || '#';
    els.modal.classList.remove('hidden');
  }

  function closeModal() {
    els.modal.classList.add('hidden');
  }

  function showScreen(target) {
    state.screen = target;
    if (target === 'A') {
      els.screenA.classList.remove('hidden');
      els.screenB.classList.add('hidden');
      renderQuestionStage();
    } else {
      els.screenA.classList.add('hidden');
      els.screenB.classList.remove('hidden');
      renderResults();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goNext() {
    var steps = getActiveSteps();
    if (state.currentStepIndex < steps.length - 1) {
      state.currentStepIndex++;
      renderQuestionStage();
    } else {
      showScreen('B');
    }
  }

  // Event wiring
  els.prevBtn.addEventListener('click', function () {
    if (state.currentStepIndex > 0) {
      state.currentStepIndex--;
      renderQuestionStage();
    }
  });
  els.nextBtn.addEventListener('click', goNext);

  function resetAll() {
    state.user = createInitialState();
    state.currentStepIndex = 0;
    state.checkFilter = 'all';
    showScreen('A');
  }

  els.resetInputBtn.addEventListener('click', resetAll);
  els.resetAllBtn.addEventListener('click', resetAll);
  els.editInputsBtn.addEventListener('click', function () {
    showScreen('A');
  });

  document.querySelectorAll('.demo-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-preset');
      if (PRESETS[key]) {
        state.user = Object.assign({}, PRESETS[key], { vulnerabilities: PRESETS[key].vulnerabilities.slice() });
        state.checkFilter = 'all';
        showScreen('B');
      }
    });
  });

  els.datasetSelect.addEventListener('change', function () {
    state.customNotices = null;
    state.customLabel = '';
    state.datasetKey = els.datasetSelect.value;
    updateDatasetInfo();
    if (state.screen === 'B') renderResults();
  });

  els.refDateInput.addEventListener('change', function () {
    if (els.refDateInput.value) {
      state.refDate = els.refDateInput.value;
      updateDatasetInfo();
      if (state.screen === 'B') renderResults();
    }
  });

  els.csvFileInput.addEventListener('change', function () {
    var file = els.csvFileInput.files && els.csvFileInput.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var parsed = Matcher.parseCsvText(String(reader.result || ''));
      state.customNotices = parsed;
      state.customLabel = '로컬 CSV (' + file.name + ')';
      updateDatasetInfo();
      if (state.screen === 'B') renderResults();
    };
    reader.readAsText(file, 'utf-8');
  });

  els.modalCloseBtn.addEventListener('click', closeModal);
  els.modal.addEventListener('click', function (e) {
    if (e.target === els.modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !els.modal.classList.contains('hidden')) closeModal();
  });

  function applyRemotePayload(payload) {
    if (!payload || !payload.sources) return false;
    Object.keys(payload.sources).forEach(function (k) {
      Datasets[k] = payload.sources[k];
    });
    state.remoteLoading = false;
    updateDatasetInfo();
    if (state.screen === 'B') renderResults();
    return true;
  }

  function loadRemoteNoticesIfConfigured() {
    var jsonUrl = window.NOTICE_REMOTE_JSON_URL || '';
    var csvUrl = window.NOTICE_REMOTE_CSV_URL || '';
    if (!jsonUrl && !csvUrl) return;
    state.remoteLoading = true;
    updateDatasetInfo();

    var tryCsvFallback = function () {
      if (!csvUrl) {
        state.remoteLoading = false;
        updateDatasetInfo();
        return;
      }
      window.fetch(csvUrl, { credentials: 'omit', cache: 'no-cache' })
        .then(function (resp) {
          if (!resp.ok) throw new Error('HTTP ' + resp.status);
          return resp.text();
        })
        .then(function (text) {
          var parsed = Matcher.parseCsvText(String(text || ''));
          Datasets.full = {
            label: 'GitHub 최신 목록 (data/list.csv)',
            count: parsed.length,
            rows: parsed
          };
          state.remoteLoading = false;
          updateDatasetInfo();
          if (state.screen === 'B') renderResults();
        })
        .catch(function () {
          state.remoteLoading = false;
          updateDatasetInfo();
        });
    };

    if (jsonUrl) {
      window.fetch(jsonUrl, { credentials: 'omit', cache: 'no-cache' })
        .then(function (resp) {
          if (!resp.ok) throw new Error('HTTP ' + resp.status);
          return resp.json();
        })
        .then(function (data) {
          if (!applyRemotePayload(data)) tryCsvFallback();
        })
        .catch(tryCsvFallback);
    } else {
      tryCsvFallback();
    }
  }

  // Init
  updateDatasetInfo();
  showScreen('A');
  loadRemoteNoticesIfConfigured();
})();

}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', __kkeobiBootNoticeMatch);
} else {
  __kkeobiBootNoticeMatch();
}
