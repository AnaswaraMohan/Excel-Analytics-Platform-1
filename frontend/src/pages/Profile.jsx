import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../utils/auth';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { 
  Box, 
  Heading, 
  Text, 
  Flex, 
  Stack, 
  Badge, 
  Button, 
  Avatar, 
  useColorModeValue,
  Grid,
  GridItem,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Container,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab, 
  TabPanel,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Switch
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiEdit, FiSave, FiX } from 'react-icons/fi';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [hideEmail, setHideEmail] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteInputRef = useRef();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Form errors
  const [errors, setErrors] = useState({});
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
  const dangerZoneBg = useColorModeValue('red.50', 'red.900');
  const dangerZoneBorder = useColorModeValue('red.200', 'red.700');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await authService.getProfile();
        setUser(userProfile);
        setFormData({
          name: userProfile.name || '',
          displayName: userProfile.name?.split(' ')[0] || '',
          email: userProfile.email || ''
        });
      } catch (error) {
        toast.error('Failed to fetch user profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.success('Successfully logged out');
    navigate('/login');
  };
  
  const handleToggleNotifications = () => {
    setEmailNotifications(!emailNotifications);
    toast.success(`Email notifications ${!emailNotifications ? 'enabled' : 'disabled'}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordChange = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const updateProfile = async () => {
    if (!validatePersonalInfo()) return;
    
    setIsSubmitting(true);
    try {
      // Use the auth service to update profile
      await authService.updateProfile({
        name: formData.name,
        email: formData.email
      });
      
      // Update local user state
      setUser({
        ...user,
        name: formData.name,
        email: formData.email
      });
      
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const changePassword = async () => {
    if (!validatePasswordChange()) return;
    
    setIsSubmitting(true);
    try {
      // Use the auth service to change password
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Reset form fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password changed successfully');
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete !== 'delete' && confirmDelete !== user?.email) {
      toast.error('Please type "delete" or your email to confirm');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Use the auth service to delete account
      await authService.deleteAccount();
      
      onClose();
      toast.success('Account deleted successfully');
      authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: user.name || '',
      displayName: user.name?.split(' ')[0] || '',
      email: user.email || ''
    });
    setEditMode(false);
  };

  if (isLoading) {
    return (
      <Flex minH="100vh" bg="gray.50" align="center" justify="center">
        <Box 
          p={8} 
          position="relative"
          borderRadius="md"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </Box>
      </Flex>
    );
  }
  
  // Format joined date
  const formatJoinedDate = () => {
    if (!user?.createdAt) return 'N/A';
    
    const createdDate = new Date(user.createdAt);
    const today = new Date();
    const diffTime = today - createdDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Joined Today';
    } else if (diffDays === 1) {
      return 'Joined Yesterday';
    } else {
      return `Joined on ${createdDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`;
    }
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Grid templateColumns={{ base: "1fr", md: "1fr 3fr" }} gap={8}>
        {/* Left Column - User Summary Card */}
        <GridItem>
          <Card bg={bgColor} shadow="md" borderRadius="lg" overflow="hidden" borderWidth="1px" borderColor={borderColor}>
            <CardHeader pb={0}>
              <Box textAlign="center" pt={4}>
                <Avatar 
                  size="2xl" 
                  name={user?.name}
                  bg="blue.500"
                  color="white"
                  mb={3}
                />
                <Heading as="h3" size="md" mb={1}>{user?.name}</Heading>
                {user?.role && (
                  <Badge 
                    colorScheme={user?.role === 'admin' ? 'purple' : 'blue'}
                    fontSize="sm"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    {user.role}
                  </Badge>
                )}
                
                <Text mt={3} fontSize="sm" color={mutedTextColor}>
                  {formatJoinedDate()}
                </Text>
              </Box>
            </CardHeader>
            
            <CardFooter pt={4} pb={4}>
              <Button 
                variant="outline" 
                colorScheme="red" 
                size="md" 
                width="full"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </CardFooter>
          </Card>

          <Box mt={4} textAlign="center">
            <Link to="/dashboard">
              <Button 
                variant="ghost" 
                colorScheme="blue" 
                size="sm"
                leftIcon={
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back to Dashboard
              </Button>
            </Link>
          </Box>
        </GridItem>

        {/* Right Column - Tab-based Settings */}
        <GridItem>
          <Card bg={bgColor} shadow="md" borderRadius="lg" overflow="hidden" borderWidth="1px" borderColor={borderColor}>
            <CardHeader borderBottomWidth="1px" borderColor={borderColor} bg="gray.50">
              <Heading as="h3" size="md">Account Settings</Heading>
            </CardHeader>
            
            <CardBody p={0}>
              <Tabs isFitted variant="enclosed" index={tabIndex} onChange={setTabIndex}>
                <TabList mb={0} borderBottom="1px" borderColor={borderColor}>
                  <Tab 
                    _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
                    py={4}
                    fontWeight="medium"
                  >
                    Personal Information
                  </Tab>
                  <Tab 
                    _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
                    py={4}
                    fontWeight="medium"
                  >
                    Security
                  </Tab>
                  <Tab 
                    _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
                    py={4}
                    fontWeight="medium"
                  >
                    Danger Zone
                  </Tab>
                </TabList>

                <TabPanels>
                  {/* Tab 1: Personal Information */}
                  <TabPanel p={6}>
                    <Box className="bg-white rounded-lg">
                      <Flex justifyContent="space-between" alignItems="center" mb={6}>
                        <Heading as="h4" size="md" fontWeight="semibold">Personal Information</Heading>
                        {!editMode ? (
                          <Button 
                            size="sm" 
                            colorScheme="blue" 
                            variant="outline"
                            leftIcon={<Icon as={FiEdit} />}
                            onClick={() => setEditMode(true)}
                          >
                            Edit
                          </Button>
                        ) : (
                          <Flex gap={2}>
                            <Button 
                              size="sm" 
                              variant="outline"
                              leftIcon={<Icon as={FiX} />}
                              onClick={cancelEdit}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm" 
                              colorScheme="blue"
                              leftIcon={<Icon as={FiSave} />}
                              onClick={updateProfile}
                              isLoading={isSubmitting}
                            >
                              Save
                            </Button>
                          </Flex>
                        )}
                      </Flex>

                      {!editMode ? (
                        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                          <Box>
                            <Text className="text-sm text-gray-500 uppercase font-semibold">Full Name</Text>
                            <Text className="text-base text-gray-800 font-medium mt-1">{user?.name}</Text>
                          </Box>
                          
                          <Box>
                            <Text className="text-sm text-gray-500 uppercase font-semibold">Display Name</Text>
                            <Text className="text-base text-gray-800 font-medium mt-1">{formData.displayName}</Text>
                          </Box>
                          
                          <Box>
                            <Text className="text-sm text-gray-500 uppercase font-semibold">Email Address</Text>
                            <Flex alignItems="center" mt={1}>
                              <Text className="text-base text-gray-800 font-medium">
                                {hideEmail ? `${user?.email.substring(0, 3)}****${user?.email.substring(user?.email.lastIndexOf('@'))}` : user?.email}
                              </Text>
                              <Button 
                                variant="ghost"
                                size="xs"
                                ml={2}
                                onClick={() => setHideEmail(!hideEmail)}
                              >
                                {hideEmail ? "Show" : "Hide"}
                              </Button>
                            </Flex>
                          </Box>

                          <Box>
                            <Text className="text-sm text-gray-500 uppercase font-semibold">Member Since</Text>
                            <Text className="text-base text-gray-800 font-medium mt-1">{formatJoinedDate()}</Text>
                          </Box>
                        </Grid>
                      ) : (
                        <form>
                          <VStack spacing={5} align="stretch">
                            <FormControl isRequired isInvalid={errors.name}>
                              <FormLabel>Full Name</FormLabel>
                              <Input 
                                name="name" 
                                value={formData.name} 
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                              />
                              <FormErrorMessage>{errors.name}</FormErrorMessage>
                            </FormControl>
                            
                            <FormControl>
                              <FormLabel>Display Name</FormLabel>
                              <Input 
                                name="displayName" 
                                value={formData.displayName} 
                                onChange={handleInputChange}
                                placeholder="Enter your display name"
                              />
                            </FormControl>
                            
                            <FormControl isRequired isInvalid={errors.email}>
                              <FormLabel>Email Address</FormLabel>
                              <Input 
                                type="email"
                                name="email" 
                                value={formData.email} 
                                onChange={handleInputChange}
                                placeholder="Enter your email address"
                              />
                              <FormErrorMessage>{errors.email}</FormErrorMessage>
                            </FormControl>
                            
                            <FormControl>
                              <FormLabel>Email Visibility</FormLabel>
                              <Switch 
                                colorScheme="blue" 
                                size="md" 
                                isChecked={!hideEmail} 
                                onChange={() => setHideEmail(!hideEmail)}
                              />
                              <Text fontSize="sm" color={mutedTextColor} mt={1}>
                                When disabled, your email will be partially hidden on your profile
                              </Text>
                            </FormControl>
                          </VStack>
                        </form>
                      )}
                      
                      <Divider my={6} />
                      
                      <Box mt={4}>
                        <Heading as="h4" size="sm" fontWeight="semibold" mb={3}>Notification Preferences</Heading>
                        <Flex justifyContent="space-between" alignItems="center">
                          <Box>
                            <Text className="text-sm text-gray-500 uppercase font-semibold">Email Notifications</Text>
                            <Text className="text-sm text-gray-600 mt-1">
                              Receive alerts and updates via email
                            </Text>
                          </Box>
                          <Switch 
                            colorScheme="blue" 
                            size="md" 
                            isChecked={emailNotifications} 
                            onChange={handleToggleNotifications}
                          />
                        </Flex>
                      </Box>
                    </Box>
                  </TabPanel>
                  
                  {/* Tab 2: Security */}
                  <TabPanel p={6}>
                    <Box className="bg-white rounded-lg">
                      <Heading as="h4" size="md" fontWeight="semibold" mb={6}>Security Settings</Heading>
                      
                      <Box className="border border-gray-200 rounded-lg p-6 mb-6">
                        <Heading as="h5" size="sm" fontWeight="semibold" mb={4}>Change Password</Heading>
                        
                        <VStack spacing={5} align="stretch">
                          <FormControl isRequired isInvalid={errors.currentPassword}>
                            <FormLabel>Current Password</FormLabel>
                            <InputGroup>
                              <Input 
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword" 
                                value={passwordData.currentPassword} 
                                onChange={handlePasswordChange}
                                placeholder="Enter current password"
                              />
                              <InputRightElement width="4.5rem">
                                <Button
                                  h="1.75rem"
                                  size="sm"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                  <Icon as={showCurrentPassword ? FiEyeOff : FiEye} />
                                </Button>
                              </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{errors.currentPassword}</FormErrorMessage>
                          </FormControl>
                          
                          <FormControl isRequired isInvalid={errors.newPassword}>
                            <FormLabel>New Password</FormLabel>
                            <InputGroup>
                              <Input 
                                type={showPassword ? 'text' : 'password'}
                                name="newPassword" 
                                value={passwordData.newPassword} 
                                onChange={handlePasswordChange}
                                placeholder="Enter new password"
                              />
                              <InputRightElement width="4.5rem">
                                <Button
                                  h="1.75rem"
                                  size="sm"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  <Icon as={showPassword ? FiEyeOff : FiEye} />
                                </Button>
                              </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                          </FormControl>
                          
                          <FormControl isRequired isInvalid={errors.confirmPassword}>
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup>
                              <Input 
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword" 
                                value={passwordData.confirmPassword} 
                                onChange={handlePasswordChange}
                                placeholder="Confirm new password"
                              />
                              <InputRightElement width="4.5rem">
                                <Button
                                  h="1.75rem"
                                  size="sm"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  <Icon as={showConfirmPassword ? FiEyeOff : FiEye} />
                                </Button>
                              </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                          </FormControl>
                          
                          <Button 
                            colorScheme="blue" 
                            isLoading={isSubmitting}
                            onClick={changePassword}
                          >
                            Update Password
                          </Button>
                        </VStack>
                      </Box>
                      
                      <Box className="border border-gray-200 rounded-lg p-6">
                        <Heading as="h5" size="sm" fontWeight="semibold" mb={4}>Two-Factor Authentication</Heading>
                        <Flex justifyContent="space-between" alignItems="center">
                          <Box>
                            <Text className="text-sm text-gray-600">
                              Add an extra layer of security to your account
                            </Text>
                            <Text className="text-sm font-semibold mt-1">
                              Status: <Badge colorScheme="red" ml={1}>Disabled</Badge>
                            </Text>
                          </Box>
                          <Button size="sm" colorScheme="blue">
                            Enable 2FA
                          </Button>
                        </Flex>
                      </Box>
                    </Box>
                  </TabPanel>
                  
                  {/* Tab 3: Danger Zone */}
                  <TabPanel p={6}>
                    <Box 
                      className="bg-white rounded-lg"
                      borderWidth="1px" 
                      borderColor={dangerZoneBorder} 
                      bg={dangerZoneBg} 
                      p={6}
                    >
                      <Heading as="h4" size="md" fontWeight="semibold" mb={6} color="red.600">
                        Danger Zone
                      </Heading>
                      
                      <Text className="text-gray-700 mb-4">
                        The following actions are irreversible. Please proceed with caution.
                      </Text>
                      
                      <Box className="border border-red-300 bg-white rounded-lg p-6">
                        <Flex 
                          justifyContent="space-between" 
                          alignItems={{ base: "flex-start", md: "center" }} 
                          flexDirection={{ base: "column", md: "row" }}
                          gap={4}
                        >
                          <Box>
                            <Text className="text-lg font-semibold text-gray-800">Delete Account</Text>
                            <Text className="text-sm text-gray-600 mt-1">
                              Once deleted, all your data will be permanently removed. This action cannot be undone.
                            </Text>
                          </Box>
                          <Button 
                            colorScheme="red" 
                            onClick={onOpen}
                          >
                            Delete Account
                          </Button>
                        </Flex>
                      </Box>
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
      
      {/* Delete Account Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-red-600">Delete Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text mb={4}>This action cannot be undone. All your data will be permanently deleted.</Text>
            <Text mb={6} fontWeight="bold">
              Type "delete" or your email address to confirm:
            </Text>
            <Input 
              ref={deleteInputRef}
              placeholder={`Type "delete" or ${user?.email}`}
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>Cancel</Button>
            <Button 
              colorScheme="red" 
              onClick={handleDeleteAccount}
              isDisabled={confirmDelete !== 'delete' && confirmDelete !== user?.email}
              isLoading={isSubmitting}
            >
              Delete Permanently
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Profile;
