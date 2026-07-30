// 注册电气工程师基础考试 - 高频考点数据
const HOT_POINTS = {
  common: {
    title: '公共基础高频考点',
    icon: 'fas fa-fire',
    points: [
      {
        subject: '高等数学',
        point: '极限计算',
        formula: 'L\'Hospital法则、等价无穷小替换',
        tip: '0/0型或∞/∞型未定式优先用洛必达法则,常见等价无穷小:sinx~x, ln(1+x)~x, e^x-1~x, 1-cosx~x²/2',
        frequency: '★★★★★'
      },
      {
        subject: '高等数学',
        point: '偏导数与全微分',
        formula: 'df = (∂f/∂x)dx + (∂f/∂y)dy',
        tip: '复合函数求偏导用链式法则,注意区分∂和d',
        frequency: '★★★★☆'
      },
      {
        subject: '高等数学',
        point: '二重积分计算',
        formula: '∫∫f(x,y)dxdy',
        tip: '直角坐标与极坐标转换:x=rcosθ, y=rsinθ, dxdy=rdrdθ; 注意积分次序交换',
        frequency: '★★★★★'
      },
      {
        subject: '高等数学',
        point: '级数收敛性判断',
        formula: '比值判别法: lim(n→∞) a(n+1)/a(n)',
        tip: '正项级数优先用比值法或根值法,交错级数用莱布尼茨判别法',
        frequency: '★★★★☆'
      },
      {
        subject: '普通物理',
        point: '理想气体状态方程',
        formula: 'PV = nRT',
        tip: 'R=8.314 J/(mol·K),注意单位换算;等温/等压/等容过程能量分析',
        frequency: '★★★★☆'
      },
      {
        subject: '普通物理',
        point: '波的干涉',
        formula: 'Δφ = 2π·Δr/λ',
        tip: '相位差为2π整数倍加强,π奇数倍减弱;驻波节点与波腹位置',
        frequency: '★★★☆☆'
      },
      {
        subject: '材料力学',
        point: '梁的弯曲正应力',
        formula: 'σ = My/Iz',
        tip: 'Iz为截面惯性矩,矩形截面Iz=bh³/12,圆形截面Iz=πd⁴/64;最大应力在上下边缘',
        frequency: '★★★★★'
      },
      {
        subject: '流体力学',
        point: '伯努利方程',
        formula: 'z₁ + P₁/ρg + v₁²/2g = z₂ + P₂/ρg + v₂²/2g',
        tip: '适用条件:恒定流、不可压缩、理想流体;注意沿程水头损失hf=λ(l/d)(v²/2g)',
        frequency: '★★★★☆'
      },
      {
        subject: '计算机基础',
        point: 'IP地址与子网划分',
        formula: '子网数=2^n, 每子网主机数=2^m-2',
        tip: 'n为借用的主机位,m为剩余主机位;全0为网络地址,全1为广播地址',
        frequency: '★★★★☆'
      },
      {
        subject: '工程经济',
        point: '资金时间价值',
        formula: 'F = P(1+i)^n',
        tip: '现值P、终值F、年金A换算;复利系数表查阅',
        frequency: '★★★★☆'
      }
    ]
  },

  powerDistribution: {
    title: '供配电高频考点',
    icon: 'fas fa-fire',
    points: [
      {
        subject: '电路与电磁场',
        point: '相量法分析正弦交流电路',
        formula: 'Z = R + j(ωL - 1/ωC)',
        tip: '复阻抗计算,感抗XL=ωL,容抗XC=1/ωC;功率因数cosφ=R/|Z|',
        frequency: '★★★★★'
      },
      {
        subject: '电路与电磁场',
        point: '三相电路功率计算',
        formula: 'P = √3·U线·I线·cosφ',
        tip: '星形接法:U线=√3U相,I线=I相;三角形接法:U线=U相,I线=√3I相',
        frequency: '★★★★★'
      },
      {
        subject: '电气工程基础',
        point: '标幺值计算',
        formula: '标幺值 = 实际值 / 基准值',
        tip: '选取基准容量Sb和基准电压Ub,基准电流Ib=Sb/(√3·Ub),基准阻抗Zb=Ub²/Sb',
        frequency: '★★★★★'
      },
      {
        subject: '电气工程基础',
        point: '三相短路计算',
        formula: 'Ik = 1/Z*(标幺值)',
        tip: '短路容量Sk=√3·U·Ik;冲击电流ish=2.55·I″(高压),1.84·I″(低压)',
        frequency: '★★★★★'
      },
      {
        subject: '电气工程基础',
        point: '变压器参数计算',
        formula: 'Rk = Pk/Ik², Xk = √(Zk² - Rk²)',
        tip: '短路试验求Rk、Xk;空载试验求Rm、Xm;注意归算到同一侧',
        frequency: '★★★★☆'
      },
      {
        subject: '电气工程基础',
        point: '接地电阻计算',
        formula: 'R = ρ/(2πL)·ln(L²/dh)',
        tip: 'ρ为土壤电阻率,常见接地形式:垂直接地极、水平接地极、复合接地网',
        frequency: '★★★★☆'
      },
      {
        subject: '电气工程基础',
        point: '供配电系统接线',
        formula: '—',
        tip: '放射式、树干式、环式接线特点;一级负荷必须双电源,二级负荷宜双电源',
        frequency: '★★★☆☆'
      },
      {
        subject: '模拟电子技术',
        point: '运放线性应用',
        formula: '反相比例: Uo = -(Rf/R1)·Ui',
        tip: '虚短U+=U-,虚断I+=I-=0;同相比例、加法、减法、积分电路分析',
        frequency: '★★★★☆'
      }
    ]
  },

  powerTransmission: {
    title: '发输变电高频考点',
    icon: 'fas fa-fire',
    points: [
      {
        subject: '电路与电磁场',
        point: '相量法分析正弦交流电路',
        formula: 'Z = R + j(ωL - 1/ωC)',
        tip: '复阻抗计算,功率因数cosφ=R/|Z|',
        frequency: '★★★★★'
      },
      {
        subject: '电气工程基础',
        point: '标幺值计算',
        formula: '标幺值 = 实际值 / 基准值',
        tip: '选取基准容量Sb和基准电压Ub,多电压级归算',
        frequency: '★★★★★'
      },
      {
        subject: '电气工程基础',
        point: '电力系统三相短路',
        formula: 'I″ = E″/XΣ*(标幺值)',
        tip: '次暂态短路电流I″,冲击电流ish=2.55I″;短路容量Sk=√3·Uav·I″',
        frequency: '★★★★★'
      },
      {
        subject: '电气工程基础',
        point: '发电机功角特性',
        formula: 'P = (E·U/X)·sinδ',
        tip: '隐极机Pmax=EU/X,凸极机有附加电磁功率;静态稳定极限δ=90°',
        frequency: '★★★★★'
      },
      {
        subject: '电气工程基础',
        point: '电力系统稳定性',
        formula: '加速面积 = 减速面积(等面积定则)',
        tip: '静态稳定储备系数Kp=(Pmax-P0)/P0×100%;暂态稳定用等面积定则判断',
        frequency: '★★★★☆'
      },
      {
        subject: '电气工程基础',
        point: '内部过电压',
        formula: '操作过电压倍数 = 最大过电压幅值/最高运行相电压',
        tip: '分类:操作过电压(合空载线路、切空载变压器)、谐振过电压、工频过电压',
        frequency: '★★★★☆'
      },
      {
        subject: '电气工程基础',
        point: '电力线路参数',
        formula: '串联阻抗Z=R+jX,并联导纳Y=jB',
        tip: '电阻r0、电抗x0、电纳b0、电导g0;长线路需考虑分布参数',
        frequency: '★★★☆☆'
      },
      {
        subject: '电气工程基础',
        point: '变压器接线组别',
        formula: 'Yy0、Yd11等',
        tip: '高压侧相量指向12点,低压侧相量所指钟点数即为组别号',
        frequency: '★★★☆☆'
      }
    ]
  }
};
