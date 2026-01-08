import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  reactLogo: {
    width: '40%',
    height: '50%',
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    gap: 8
  },
  loginHelpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 20,
  },
  socialContainer: {
  },
  footerContainer: {
    alignItems: 'center',
    fontSize: 6,
    marginTop: 40,
    marginBottom: 20,
    },
  input: {
    width: '100%',
    backgroundColor: '#fcfcfcff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingLeft: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#757575ff'
  },
  loginButton: {
    width: '100%',
    backgroundColor: 'rgba(241, 129, 30, 1)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  loginButtonText: {
    color: '#ffffffff',
    textAlign: 'center',
  },
  linkText: {
    color: '#757575',
    fontSize: 13,
  },
  divider: {
    color: '#bdbdbd',
    fontSize: 13,
  },
  kakaoLoginButton:{
    width: '100%',
    backgroundColor: 'rgba(255, 221, 0, 1)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginTop: 8,
  },
  naverLoginButton:{
        width: '100%',
    backgroundColor: 'rgba(0, 255, 72, 1)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginTop: 8,
  },
  footerText:{
    color: '#757575',
    fontSize: 12,
  }
});
