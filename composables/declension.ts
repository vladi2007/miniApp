function declOfNum(n: number, titles: string[]) {
  if (n % 100 == 11 || n %  100 == 12 || n %  100 == 13 || n % 100 == 14){
			return  titles[0];
		}
		else if (n % 10 == 1) return titles[1];
		else if (n % 10 == 2 || n % 10 == 3 || n % 10 == 4 ) return titles[2];
		else return titles[0];
}

export default declOfNum;