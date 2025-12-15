import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import * as math from 'mathjs';

const basicPad = [
	['7', '8', '9', '/'],
	['4', '5', '6', '*'],
	['1', '2', '3', '-'],
	['0', '.', '=', '+'],
	['(', ')', 'ANS', 'DEL'],
];

const sciPad = [
	['sin(', 'cos(', 'tan(', 'asin(', 'acos('],
	['log(', 'ln(', 'exp(', 'sqrt(', '^'],
	['pi', 'e', 'i', 'abs(', 'pow('],
];

const quickMacros = [
	{ label: 'det 2x2', snippet: 'det([[3,-1],[2,5]])' },
	{ label: 'dot •', snippet: 'dot([1,2,3],[4,5,6])' },
	{ label: 'cross ×', snippet: 'cross([1,0,0],[0,1,0])' },
	{ label: '|z|', snippet: 'abs(3 + 4i)' },
	{ label: 'exp(-jw t)', snippet: 'exp(-i*2*pi*60*t)' },
	{ label: 'sqrt(3)', snippet: 'sqrt(3)' },
];

const evaluatePolynomial = (coeffs, value) => {
	return coeffs.reduce((acc, coeff) => math.add(math.multiply(acc, value), coeff));
};

const formatComplex = (complexValue) => {
	if (typeof complexValue === 'number') {
		return complexValue.toFixed(6).replace(/\.0+$/, '');
	}
	const real = complexValue.re || 0;
	const imag = complexValue.im || 0;
	const realStr = Math.abs(real) < 1e-9 ? '0' : real.toFixed(6).replace(/\.0+$/, '');
	const imagStr = Math.abs(imag) < 1e-9 ? '0' : imag.toFixed(6).replace(/\.0+$/, '');
	if (Math.abs(imag) < 1e-9) {
		return realStr;
	}
	const sign = imag >= 0 ? '+' : '-';
	return `${realStr} ${sign} ${Math.abs(imagStr)}i`;
};

const findPolynomialRoots = (coefficients) => {
	const normalized = coefficients.map((value) => math.complex(value, 0));
	const leading = normalized[0];
	if (math.equal(leading, 0)) {
		throw new Error('최고차항의 계수는 0이 될 수 없습니다.');
	}
	const monic = normalized.map((value) => math.divide(value, leading));
	const degree = monic.length - 1;
	const radius = 1 + Math.max(...monic.slice(1).map((c) => math.abs(c)));
	const roots = Array.from({ length: degree }, (_, idx) => math.complex({ r: radius, phi: (2 * Math.PI * idx) / degree }));

	for (let iter = 0; iter < 80; iter++) {
		let maxDelta = 0;
		for (let i = 0; i < roots.length; i++) {
			let numerator = evaluatePolynomial(monic, roots[i]);
			let denominator = math.complex(1, 0);
			for (let j = 0; j < roots.length; j++) {
				if (i !== j) {
					denominator = math.multiply(denominator, math.subtract(roots[i], roots[j]));
				}
			}
			const delta = math.divide(numerator, denominator);
			roots[i] = math.subtract(roots[i], delta);
			maxDelta = Math.max(maxDelta, math.abs(delta));
		}
		if (maxDelta < 1e-9) break;
	}

	return roots;
};

const integrateNumerically = (expression, variable, lower, upper, steps = 600) => {
	if (steps % 2 !== 0) steps += 1;
	const scope = {};
	const h = (upper - lower) / steps;
	let sum = 0;

	for (let i = 0; i <= steps; i++) {
		const x = lower + i * h;
		scope[variable] = x;
		const fx = math.evaluate(expression, scope);
		if (i === 0 || i === steps) {
			sum += fx;
		} else if (i % 2 === 0) {
			sum += 2 * fx;
		} else {
			sum += 4 * fx;
		}
	}
	return (h / 3) * sum;
};

export default function Calculator() {
	const { isDark } = useTheme();
	const [input, setInput] = useState('');
	const [result, setResult] = useState('');
	const [history, setHistory] = useState([]);
	const [polyInput, setPolyInput] = useState('1,-3,2');
	const [polyOutput, setPolyOutput] = useState([]);
	const [polyError, setPolyError] = useState('');
	const [derivativeExpression, setDerivativeExpression] = useState('x^3 + 2*x');
	const [derivativeVariable, setDerivativeVariable] = useState('x');
	const [derivativeResult, setDerivativeResult] = useState('');
	const [integralExpression, setIntegralExpression] = useState('sin(x)');
	const [integralVariable, setIntegralVariable] = useState('x');
	const [integralBounds, setIntegralBounds] = useState({ from: '0', to: '3.14159' });
	const [integralResult, setIntegralResult] = useState('');
	const [integralError, setIntegralError] = useState('');

	const containerClass = isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900';
	const buttonClass = isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900';
	const operatorClass = isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white';

	const appendValue = (value) => {
		if (value === 'DEL') {
			setInput((prev) => prev.slice(0, -1));
			return;
		}
		if (value === '=') {
			handleEvaluate();
			return;
		}
		if (value === 'ANS') {
			if (history.length > 0) {
				setInput((prev) => prev + history[history.length - 1].result);
			}
			return;
		}
		setInput((prev) => prev + value);
	};

	const handleEvaluate = () => {
		if (!input.trim()) return;
		try {
			const expression = input.replace(/π/g, 'pi').replace(/√/g, 'sqrt');
			let calcResult = math.evaluate(expression);
			if (typeof calcResult === 'number') {
				calcResult = calcResult.toPrecision(10).replace(/\.0+$/, '');
			} else if (math.typeOf(calcResult) === 'Complex') {
				calcResult = formatComplex(calcResult);
			}
			setResult(String(calcResult));
			setHistory((prev) => [...prev.slice(-9), { expression: input, result: String(calcResult) }]);
		} catch (err) {
			setResult(`오류: ${err.message}`);
		}
	};

	const handlePolynomialSolve = () => {
		setPolyError('');
		try {
			const coefficients = polyInput
				.split(',')
				.map((value) => value.trim())
				.filter((value) => value.length > 0)
				.map((value) => Number(value));

			if (coefficients.length < 2) {
				throw new Error('최소 2개의 계수가 필요합니다. (예: 1,-3,2)');
			}
			if (coefficients.some((value) => Number.isNaN(value))) {
				throw new Error('모든 계수는 숫자여야 합니다.');
			}

			const roots = findPolynomialRoots(coefficients);
			setPolyOutput(roots.map((root) => formatComplex(root)));
		} catch (error) {
			setPolyError(error.message);
			setPolyOutput([]);
		}
	};

	const handleDerivative = () => {
		try {
			const derivative = math.derivative(derivativeExpression, derivativeVariable).toString();
			setDerivativeResult(`d/d${derivativeVariable} = ${derivative}`);
		} catch (error) {
			setDerivativeResult(`미분 오류: ${error.message}`);
		}
	};

	const handleIntegral = () => {
		setIntegralError('');
		try {
			const lower = Number(integralBounds.from);
			const upper = Number(integralBounds.to);
			if (Number.isNaN(lower) || Number.isNaN(upper)) {
				throw new Error('구간은 숫자여야 합니다.');
			}
			if (lower === upper) {
				throw new Error('구간 길이가 0입니다.');
			}
			const value = integrateNumerically(integralExpression, integralVariable, lower, upper);
			setIntegralResult(`∫ ${integralExpression} d${integralVariable} = ${Number(value).toPrecision(8)}`);
		} catch (error) {
			setIntegralError(error.message);
			setIntegralResult('');
		}
	};

	return (
		<div className="space-y-10">
			<motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
				<h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 dark:from-indigo-300 dark:to-blue-300 bg-clip-text text-transparent">
					공학 계산 스튜디오
				</h1>
				<p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
					실시간 수식 계산, 다항식 근 찾기, 미분/적분 등 공학 용도의 풀스택 계산 도구입니다.
				</p>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-6">
					{[
						{ label: '연산 파이프라인', value: '멀티 패드 + 히스토리' },
						{ label: '고차 방정식', value: '최대 10차 Durand-Kerner' },
						{ label: '미/적분 엔진', value: 'math.js 심볼릭 + Simpson' },
						{ label: '복소 · 벡터', value: 'i, det, dot/cross 지원' },
					].map((tile) => (
						<div
							key={tile.label}
							className={`p-4 rounded-2xl border text-sm ${isDark ? 'bg-gray-900/70 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-700'}`}
						>
							<p className="font-semibold text-xs uppercase tracking-wide text-blue-500">{tile.label}</p>
							<p className="mt-2 text-base font-medium">{tile.value}</p>
						</div>
					))}
				</div>
			</motion.div>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className={`xl:col-span-2 p-6 rounded-3xl border shadow-sm ${containerClass}`}>
					<div className="space-y-6">
						<div className={`relative overflow-hidden rounded-2xl p-6 ${isDark ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' : 'bg-gradient-to-br from-white via-blue-50 to-blue-100 border border-blue-100'}`}>
							<span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Expression</span>
							<input
								className={`w-full bg-transparent text-right text-3xl font-semibold mt-3 focus:outline-none ${isDark ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-500'}`}
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="식을 입력하세요 (예: (3+4i)*(2-i) + sin(pi/3))"
							/>
							{result && (
								<p className={`text-right text-lg font-mono mt-2 ${result.startsWith('오류') ? 'text-red-300' : 'text-emerald-300'}`}>
									= {result}
								</p>
							)}
							<button onClick={handleEvaluate} className={`mt-4 px-4 py-2 rounded-full text-sm font-semibold ${operatorClass}`}>
								실행 / ENTER
							</button>
						</div>

						<div className="space-y-2">
							<p className={`text-xs font-semibold tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>자주 쓰는 공학 스니펫</p>
							<div className="flex flex-wrap gap-2">
								{quickMacros.map((chip) => (
									<button
										key={chip.label}
										onClick={() => appendValue(chip.snippet)}
										className={`px-3 py-1.5 rounded-full text-xs font-medium border ${isDark ? 'border-gray-700 text-gray-200 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
									>
										{chip.label}
									</button>
								))}
							</div>
						</div>

						<div className="grid gap-5 md:grid-cols-2">
							<div className={`p-4 rounded-2xl border ${isDark ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-white'}`}>
								<div className="flex items-center justify-between mb-3">
									<h3 className="text-lg font-semibold">기본 키패드</h3>
									<span className="text-xs text-blue-500">실수 · 복소 연산</span>
								</div>
								<div className="grid grid-cols-4 gap-3">
									{basicPad.map((row, rowIndex) => (
										<div className="contents" key={`basic-${rowIndex}`}>
											{row.map((key) => (
												<button
													key={key}
													onClick={() => appendValue(key === 'pi' ? 'π' : key)}
													className={`py-3 rounded-xl font-semibold text-lg transition ${['/', '*', '-', '+', '=', 'ANS'].includes(key) ? operatorClass : buttonClass}`}
												>
													{key}
												</button>
											))}
										</div>
									))}
								</div>
							</div>
							<div className={`p-4 rounded-2xl border ${isDark ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-white'}`}>
								<div className="flex items-center justify-between mb-3">
									<h3 className="text-lg font-semibold">공학 함수</h3>
									<span className="text-xs text-blue-500">삼각 · 로그 · 지수</span>
								</div>
								<div className="grid grid-cols-5 gap-3">
									{sciPad.map((row, rowIndex) => (
										<div className="contents" key={`sci-${rowIndex}`}>
											{row.map((key) => (
												<button
													key={key}
													onClick={() => appendValue(key === 'pi' ? 'π' : key)}
													className={`py-3 rounded-xl font-semibold text-sm transition ${operatorClass}`}
												>
													{key}
												</button>
											))}
										</div>
									))}
								</div>
								<button onClick={handleEvaluate} className={`w-full mt-3 py-3 rounded-xl font-semibold text-lg ${operatorClass}`}>
									계산 (=)
								</button>
							</div>
						</div>

						<div className={`p-5 rounded-2xl border ${isDark ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-white'}`}>
							<div className="flex items-center justify-between mb-2">
								<p className="font-semibold">최근 10개 계산</p>
								<button onClick={() => setHistory([])} className={`text-sm ${isDark ? 'text-red-300' : 'text-red-500'}`}>
									기록 삭제
								</button>
							</div>
							<div className="max-h-64 overflow-y-auto space-y-2">
								{history.length === 0 && <p className="text-sm text-gray-500">기록 없음</p>}
								{history.map((entry, idx) => (
									<button
										key={`${entry.expression}-${idx}`}
										onClick={() => {
											setInput(entry.expression);
											setResult(entry.result);
										}}
										className={`w-full text-left p-3 rounded-xl ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
									>
										<p className="text-sm break-words">{entry.expression}</p>
										<p className="text-sm font-semibold text-green-500">= {entry.result}</p>
									</button>
								))}
							</div>
						</div>
					</div>
				</motion.div>

				<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
					<div className={`p-6 rounded-2xl border shadow-sm ${containerClass}`}>
						<h2 className="text-xl font-bold mb-4">다항식 근 찾기</h2>
						<p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
							최고차항부터 계수 입력 (예: x² - 3x + 2 → <span className="font-mono">1,-3,2</span>)
						</p>
						<input
							value={polyInput}
							onChange={(e) => setPolyInput(e.target.value)}
							className={`w-full mb-3 px-4 py-2 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
						/>
						<button onClick={handlePolynomialSolve} className={`w-full py-3 rounded-xl font-semibold ${operatorClass}`}>
							근 계산하기
						</button>
						{polyError && <p className="text-sm text-red-400 mt-3">{polyError}</p>}
						{polyOutput.length > 0 && (
							<ul className="mt-4 space-y-1 text-sm font-mono">
								{polyOutput.map((root, idx) => (
									<li key={idx}>x{idx + 1} = {root}</li>
								))}
							</ul>
						)}
					</div>

					<div className={`p-6 rounded-2xl border shadow-sm ${containerClass}`}>
						<h2 className="text-xl font-bold mb-4">미분 계산</h2>
						<input
							value={derivativeExpression}
							onChange={(e) => setDerivativeExpression(e.target.value)}
							className={`w-full mb-3 px-4 py-2 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
							placeholder="f(x) = "
						/>
						<div className="flex items-center gap-3 mb-3">
							<label className="text-sm">변수</label>
							<input
								value={derivativeVariable}
								onChange={(e) => setDerivativeVariable(e.target.value)}
								className={`w-16 text-center px-2 py-2 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
							/>
							<button onClick={handleDerivative} className={`flex-1 py-2 rounded-xl font-semibold ${operatorClass}`}>
								d/d{derivativeVariable}
							</button>
						</div>
						{derivativeResult && <p className="text-sm font-mono text-green-400">{derivativeResult}</p>}
					</div>

					<div className={`p-6 rounded-2xl border shadow-sm ${containerClass}`}>
						<h2 className="text-xl font-bold mb-4">수치 적분</h2>
						<input
							value={integralExpression}
							onChange={(e) => setIntegralExpression(e.target.value)}
							className={`w-full mb-3 px-4 py-2 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
							placeholder="f(x)"
						/>
						<div className="flex items-center gap-3 mb-3">
							<label className="text-sm">변수</label>
							<input
								value={integralVariable}
								onChange={(e) => setIntegralVariable(e.target.value)}
								className={`w-20 text-center px-3 py-2 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
							/>
							<input
								value={integralBounds.from}
								onChange={(e) => setIntegralBounds((prev) => ({ ...prev, from: e.target.value }))}
								className={`flex-1 px-3 py-2 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
								placeholder="하한"
							/>
							<input
								value={integralBounds.to}
								onChange={(e) => setIntegralBounds((prev) => ({ ...prev, to: e.target.value }))}
								className={`flex-1 px-3 py-2 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
								placeholder="상한"
							/>
						</div>
						<button onClick={handleIntegral} className={`w-full py-3 rounded-xl font-semibold ${operatorClass}`}>
							∫ 계산하기
						</button>
						{integralError && <p className="text-sm text-red-400 mt-3">{integralError}</p>}
						{integralResult && <p className="text-sm font-mono text-green-400 mt-3">{integralResult}</p>}
					</div>

					<div className={`p-6 rounded-2xl border shadow-sm ${containerClass}`}>
						<h2 className="text-xl font-bold mb-3">지원 기능 요약</h2>
						<ul className={`text-sm space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
							<li>• 복소수 연산 (예: (3+4i)*(2-i))</li>
							<li>• 다항식 근 (최대 10차, Durand-Kerner 방식)</li>
							<li>• 심볼릭 미분 (math.js 엔진)</li>
							<li>• 수치 적분 (Simpson rule)</li>
							<li>• 내장 상수 및 함수: π, e, i, trig/log, pow</li>
						</ul>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
